import React, { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

interface SentinelScene {
  id: string;
  acquired_at: string;
  month: string;
  tilejson_url: string;
  preview_url?: string | null;
  item_url?: string | null;
  relative_orbit: string;
  source: string;
}

interface SentinelScenesResponse {
  scenes: SentinelScene[];
  source: string;
  retrieved_at?: string;
  catalog_mode?: 'live' | 'cached';
}

const STUDY_URL = 'https://www.mdpi.com/2072-4292/14/12/2845';
const STUDY_HEATMAP_URL = 'https://mdpi-res.com/remotesensing/remotesensing-14-02845/article_deploy/html/images/remotesensing-14-02845-g017-550.jpg';

const dateLabel = (scene: SentinelScene) => new Date(scene.acquired_at).toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
});

const MapScene: React.FC<{ scene: SentinelScene | null }> = ({ scene }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [layerStatus, setLayerStatus] = useState<'base' | 'loading' | 'ready' | 'error'>('base');

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          'satellite-imagery': {
            type: 'raster',
            tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256,
            attribution: 'Esri, Maxar, Earthstar Geographics, and the GIS User Community',
          },
        },
        layers: [{ id: 'satellite-layer', type: 'raster', source: 'satellite-imagery', minzoom: 0, maxzoom: 19 }],
      },
      center: [76.365, 9.54],
      zoom: 11.2,
      minZoom: 9,
      maxZoom: 18,
    });
    const onBaseError = () => {
      setLayerStatus((status) => (status === 'base' ? 'error' : status));
    };
    map.on('error', onBaseError);
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;
    return () => {
      map.off('error', onBaseError);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!scene) {
      setLayerStatus('base');
      return;
    }
    let sourceReady = false;
    setLayerStatus('loading');

    const showScene = () => {
      if (map.getLayer('sentinel-1-layer')) map.removeLayer('sentinel-1-layer');
      if (map.getSource('sentinel-1-source')) map.removeSource('sentinel-1-source');
      map.addSource('sentinel-1-source', {
        type: 'raster',
        url: scene.tilejson_url,
      });
      map.addLayer({
        id: 'sentinel-1-layer',
        type: 'raster',
        source: 'sentinel-1-source',
        paint: {
          'raster-opacity': 0.9,
          'raster-contrast': 0.12,
          'raster-saturation': -0.18,
          'raster-fade-duration': 180,
        },
      });
    };

    const onSourceData = (event: maplibregl.MapSourceDataEvent) => {
      if (event.sourceId === 'sentinel-1-source' && event.isSourceLoaded) {
        sourceReady = true;
        setLayerStatus('ready');
      }
    };
    const onMapError = () => {
      if (!sourceReady) setLayerStatus('error');
    };

    map.on('sourcedata', onSourceData);
    map.on('error', onMapError);
    if (map.isStyleLoaded()) showScene();
    else map.once('style.load', showScene);
    const fallbackTimer = window.setTimeout(() => {
      if (!sourceReady) setLayerStatus('error');
    }, 10000);

    return () => {
      map.off('style.load', showScene);
      map.off('sourcedata', onSourceData);
      map.off('error', onMapError);
      window.clearTimeout(fallbackTimer);
    };
  }, [scene]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0" />
      {layerStatus === 'error' && scene?.preview_url && (
        <img
          src={scene.preview_url}
          alt={`Sentinel-1 RTC preview acquired ${dateLabel(scene)}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-white/20 bg-[#092a30]/85 px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-sm">
        {layerStatus === 'ready' ? 'Sentinel‑1 radar' : layerStatus === 'error' ? (scene?.preview_url ? 'Scene preview' : 'Tiles unavailable') : layerStatus === 'base' ? 'Satellite basemap' : 'Loading radar'}
      </div>
      {layerStatus === 'error' && !scene?.preview_url && (
        <div className="absolute inset-0 grid place-items-center bg-[#092a30] px-8 text-center font-display text-sm font-bold text-white">
          {scene ? 'Sentinel‑1 tiles could not load for this acquisition.' : 'Satellite tiles are unavailable.'}
        </div>
      )}
    </div>
  );
};

export const MapView: React.FC = () => {
  const [scenes, setScenes] = useState<SentinelScene[]>([]);
  const [earlierIndex, setEarlierIndex] = useState(0);
  const [laterIndex, setLaterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [catalogMode, setCatalogMode] = useState<'live' | 'cached'>('live');
  const [catalogRetrievedAt, setCatalogRetrievedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/v1/geo/sentinel-1/scenes?months=12')
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Geo API route not found. Restart the backend to load the Sentinel endpoint.');
          }
          throw new Error(payload.detail || 'Live catalog and saved Sentinel scenes are unavailable.');
        }
        return payload as SentinelScenesResponse;
      })
      .then((data) => {
        if (cancelled) return;
        const nextScenes = data.scenes ?? [];
        setScenes(nextScenes);
        setCatalogMode(data.catalog_mode === 'cached' ? 'cached' : 'live');
        setCatalogRetrievedAt(data.retrieved_at ?? null);
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
    <article className="overflow-hidden rounded-[22px] border border-white/10 bg-[#08282e] shadow-[0_18px_55px_rgba(6,32,37,0.28)]">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
        <span className="font-mono text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#a9d6c4]">{label}</span>
        {scenes.length > 0 ? (
          <select
            aria-label={`${label} Sentinel-1 acquisition`}
            value={index}
            onChange={(event) => onChange(Number(event.target.value))}
            className="max-w-[62%] rounded-xl border border-white/15 bg-[#123b40] px-3 py-1.5 font-mono text-[11px] font-bold text-white outline-none focus:border-[#9ac6ac]"
          >
            {scenes.map((option, optionIndex) => (
              <option key={option.id} value={optionIndex}>{dateLabel(option)}</option>
            ))}
          </select>
        ) : (
          <span className="font-mono text-[10px] font-bold text-[#d4e8db]">Vembanad</span>
        )}
      </div>
      <div className="relative h-[360px] border-t border-white/10 bg-[#0b3035]">
        <MapScene scene={scene} />
        {scene && (
          <a
            href={scene.item_url || STUDY_URL}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-3 left-3 rounded-lg border border-white/20 bg-[#08282e]/85 px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white underline underline-offset-2 backdrop-blur-sm"
          >
            Sentinel-1 RTC · {scene.relative_orbit}
          </a>
        )}
      </div>
    </article>
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-[22px] bg-[#092a30] px-5 py-4 text-white shadow-[0_14px_40px_rgba(8,42,48,0.2)] md:px-6">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#9ac6ac]">Vembanad · Kerala</p>
          <h1 className="mt-1 font-display text-2xl font-black md:text-3xl">Sentinel‑1 radar</h1>
        </div>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[10px] font-bold text-[#d4e8db]">
          {acquisitionCount} scenes · past year
        </span>
      </div>

      {catalogMode === 'cached' && (
        <p role="status" className="rounded-xl border border-[#d3a958]/50 bg-[#fbf1d9] px-4 py-2.5 font-mono text-[10px] font-bold text-[#604a20]">
          Catalog offline · showing real scenes saved {catalogRetrievedAt ? new Date(catalogRetrievedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'earlier'}
        </p>
      )}

      {loading && <p className="px-1 text-sm font-semibold text-[var(--ink-soft)]">Loading imagery…</p>}
      {!loading && error && (
        <p role="status" className="rounded-xl border border-[var(--ink)]/30 bg-[var(--paper)] px-4 py-3 font-display text-sm font-bold text-[var(--ink)]">
          {error}
        </p>
      )}

      {scenes.length > 1 && (
        <div className="grid gap-3 lg:grid-cols-2">
          {renderComparison('Earlier', earlierScene, earlierIndex, setEarlierIndex)}
          {renderComparison('Later', laterScene, laterIndex, setLaterIndex)}
        </div>
      )}
      {scenes.length === 1 && renderComparison('Latest acquisition', scenes[0], 0, () => {})}
      {scenes.length === 0 && renderComparison('Satellite view', null, 0, () => {})}

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
