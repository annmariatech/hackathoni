import React, { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

interface SentinelScene {
  id: string;
  acquired_at: string;
  month: string;
  tilejson_url: string;
  item_url?: string | null;
  relative_orbit: string;
  source: string;
}

interface SentinelScenesResponse {
  scenes: SentinelScene[];
  source: string;
}

const STUDY_URL = 'https://www.mdpi.com/2072-4292/14/12/2845';
const STUDY_HEATMAP_URL = 'https://mdpi-res.com/remotesensing/remotesensing-14-02845/article_deploy/html/images/remotesensing-14-02845-g017-550.jpg';

const dateLabel = (scene: SentinelScene) => new Date(scene.acquired_at).toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
});

const MapScene: React.FC<{ scene: SentinelScene }> = ({ scene }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm-layer', type: 'raster', source: 'osm-tiles', minzoom: 0, maxzoom: 19 }],
      },
      center: [76.365, 9.54],
      zoom: 11.2,
      minZoom: 9,
      maxZoom: 18,
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const showScene = () => {
      if (map.getLayer('sentinel-1-layer')) map.removeLayer('sentinel-1-layer');
      if (map.getSource('sentinel-1-source')) map.removeSource('sentinel-1-source');
      map.addSource('sentinel-1-source', {
        type: 'raster',
        url: scene.tilejson_url,
        tileSize: 256,
      });
      map.addLayer({
        id: 'sentinel-1-layer',
        type: 'raster',
        source: 'sentinel-1-source',
        paint: { 'raster-opacity': 0.94 },
      });
    };

    if (map.isStyleLoaded()) showScene();
    else map.once('load', showScene);
    return () => {
      map.off('load', showScene);
    };
  }, [scene]);

  return <div ref={containerRef} className="h-full w-full" />;
};

export const MapView: React.FC = () => {
  const [scenes, setScenes] = useState<SentinelScene[]>([]);
  const [earlierIndex, setEarlierIndex] = useState(0);
  const [laterIndex, setLaterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/v1/geo/sentinel-1/scenes?months=12')
      .then(async (response) => {
        if (!response.ok) throw new Error('Sentinel-1 imagery is unavailable');
        return (await response.json()) as SentinelScenesResponse;
      })
      .then((data) => {
        if (cancelled) return;
        const nextScenes = data.scenes ?? [];
        setScenes(nextScenes);
        setEarlierIndex(Math.max(0, nextScenes.length - 2));
        setLaterIndex(Math.max(0, nextScenes.length - 1));
        if (nextScenes.length === 0) setError('No Sentinel-1 scenes found for this period');
      })
      .catch((fetchError: Error) => {
        if (!cancelled) setError(fetchError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const earlierScene = scenes[earlierIndex] ?? null;
  const laterScene = scenes[laterIndex] ?? null;
  const acquisitionCount = useMemo(() => scenes.length, [scenes]);

  const renderComparison = (label: string, scene: SentinelScene | null, index: number, onChange: (value: number) => void) => (
    <article className="overflow-hidden rounded-2xl border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[2px_3px_0px_var(--ink)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ink)]/20 px-3 py-2">
        <span className="font-display text-sm font-extrabold text-[var(--ink)]">{label}</span>
        <select
          aria-label={`${label} Sentinel-1 acquisition`}
          value={index}
          onChange={(event) => onChange(Number(event.target.value))}
          className="max-w-[62%] rounded-lg border border-[var(--ink)]/30 bg-[var(--paper-2)] px-2 py-1 font-mono text-[11px] text-[var(--ink)]"
        >
          {scenes.map((option, optionIndex) => (
            <option key={option.id} value={optionIndex}>{dateLabel(option)}</option>
          ))}
        </select>
      </div>
      <div className="relative h-[360px] bg-[#dce6dc]">
        {scene && <MapScene scene={scene} />}
        {scene && (
          <a
            href={scene.item_url || STUDY_URL}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-2 left-2 rounded-lg border border-[var(--ink)]/30 bg-[var(--paper)]/95 px-2 py-1 font-mono text-[10px] font-bold text-[var(--backwater)] underline underline-offset-2"
          >
            Sentinel-1 RTC · {scene.relative_orbit}
          </a>
        )}
      </div>
    </article>
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 px-1">
        <h1 className="font-display text-2xl font-black text-[var(--ink)] md:text-3xl">
          വേമ്പനാട് · Sentinel‑1
        </h1>
        <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
          {acquisitionCount} acquisitions · 12 months
        </span>
      </div>

      {loading && <p className="px-1 text-sm font-semibold text-[var(--ink-soft)]">Loading imagery…</p>}
      {!loading && error && (
        <p role="status" className="rounded-xl border border-[var(--ink)]/30 bg-[var(--paper)] px-4 py-3 font-display text-sm font-bold text-[var(--ink)]">
          {error}
        </p>
      )}

      {scenes.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-2">
          {renderComparison('Earlier', earlierScene, earlierIndex, setEarlierIndex)}
          {renderComparison('Later', laterScene, laterIndex, setLaterIndex)}
        </div>
      )}

      <p className="px-1 text-xs text-[var(--ink-soft)]">
        Sentinel‑1 RTC scenes · no current hyacinth classification
      </p>

      <article className="overflow-hidden rounded-2xl border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[2px_3px_0px_var(--ink)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ink)]/20 px-4 py-3">
          <h2 className="font-display text-sm font-extrabold text-[var(--ink)]">Vembanad · 2019–2021 detections</h2>
          <a
            href={STUDY_URL}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[10px] font-bold uppercase tracking-wide text-[var(--backwater)] underline underline-offset-4"
          >
            Source study
          </a>
        </div>
        <img
          src={STUDY_HEATMAP_URL}
          alt="Published Sentinel-1 heatmap of water hyacinth detections in Vembanad Lake from January 2019 to January 2021"
          className="block max-h-[480px] w-full object-contain bg-white"
          loading="lazy"
        />
        <p className="px-4 py-2 text-xs text-[var(--ink-soft)]">
          Heatmap from 46 Sentinel‑1 acquisitions; locations between southern paddies and near the northern barrage.
        </p>
      </article>
    </section>
  );
};
