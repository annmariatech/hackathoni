import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { PatchCollection } from '../types';
import { BottomSheet } from './primitives/BottomSheet';
import { Stamp } from './primitives/Stamp';
import { InkButton } from './primitives/InkButton';
import { IconSatellite, IconCamera } from './primitives/HandIcons';

interface MapViewProps {
  patches: PatchCollection | null;
  selectedCrewId: string;
  onVerifyPhoto?: (patchId: string, patchName: string) => void;
}

interface SelectedPatchProps {
  id: string;
  name: string;
  choke_score: number;
  area_sqm: number;
  biomass_est_kg: number;
  growth_trend: string;
  nearest_jetty: string;
}

export const MapView: React.FC<MapViewProps> = ({ patches, selectedCrewId, onVerifyPhoto }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedPatch, setSelectedPatch] = useState<SelectedPatchProps | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize MapLibre GL with clean OSM raster tiles
    const map = new maplibregl.Map({
      container: mapContainer.current,
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
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [76.368, 9.495], // Vembanad / Punnamada center
      zoom: 12.8,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update GeoJSON layers when patches change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !patches) return;

    const updateLayers = () => {
      // Split into polygons (patches) and points (boats)
      const patchFeatures = patches.features.filter((f) => f.geometry.type === 'Polygon');
      const boatFeatures = patches.features.filter((f) => f.geometry.type === 'Point');

      // 1. Hyacinth Patches Source & Layers
      if (map.getSource('hyacinth-patches')) {
        (map.getSource('hyacinth-patches') as maplibregl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: patchFeatures as any,
        });
      } else {
        map.addSource('hyacinth-patches', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: patchFeatures as any,
          },
        });

        // Lavender Hyacinth Fill with opacity
        map.addLayer({
          id: 'patch-fills',
          type: 'fill',
          source: 'hyacinth-patches',
          paint: {
            'fill-color': [
              'step',
              ['get', 'choke_score'],
              '#8A6FD1', // Base Hyacinth purple
              0.70, '#B4532F', // Choke Warning: Laterite
              0.85, '#991B1B', // High Choke: Deep Red
            ],
            'fill-opacity': 0.72,
          },
        });

        // Ink Outline
        map.addLayer({
          id: 'patch-borders',
          type: 'line',
          source: 'hyacinth-patches',
          paint: {
            'line-color': '#1E2B24',
            'line-width': 2.5,
          },
        });

        // Click on patch opens authentic Backwater BottomSheet
        map.on('click', 'patch-fills', (e) => {
          if (!e.features || !e.features[0]) return;
          const p = e.features[0].properties as any;
          setSelectedPatch({
            id: p.id || 'patch-1',
            name: p.name || 'പുന്നമട കനാൽ പായൽ കൂട്ടം',
            choke_score: Number(p.choke_score) || 0.85,
            area_sqm: Number(p.area_sqm) || 4200,
            biomass_est_kg: Number(p.biomass_est_kg) || 10500,
            growth_trend: p.growth_trend || '+18% per week',
            nearest_jetty: p.nearest_jetty || 'Punnamada Jetty',
          });
        });

        // Cursor pointer
        map.on('mouseenter', 'patch-fills', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'patch-fills', () => {
          map.getCanvas().style.cursor = '';
        });
      }

      // 2. Harvester Boat Markers
      if (map.getSource('boats-source')) {
        (map.getSource('boats-source') as maplibregl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: boatFeatures as any,
        });
      } else {
        map.addSource('boats-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: boatFeatures as any,
          },
        });

        map.addLayer({
          id: 'boat-markers',
          type: 'circle',
          source: 'boats-source',
          paint: {
            'circle-radius': 9,
            'circle-color': '#1F6B57', // Backwater green
            'circle-stroke-width': 3,
            'circle-stroke-color': '#F6EEDC', // Kasavu paper
          },
        });
      }
    };

    if (map.isStyleLoaded()) {
      updateLayers();
    } else {
      map.once('load', updateLayers);
    }
  }, [patches]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border-2 border-[var(--ink)] shadow-2xl bg-[var(--paper-2)]">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Legend Badge */}
      <div className="absolute top-3 left-3 z-10 bg-[var(--paper)]/95 backdrop-blur-sm border-2 border-[var(--ink)] rounded-xl p-2.5 shadow-[2px_3px_0px_var(--ink)] text-xs font-display space-y-1.5 max-w-[210px]">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--ink)]/20 pb-1">
          <span className="font-bold flex items-center gap-1 text-[var(--ink)]">
            <IconSatellite size={16} />
            <span>റഡാർ പായൽ ഭൂപടം</span>
          </span>
          <Stamp type="verified" size="sm" />
        </div>
        <div className="flex items-center gap-2 text-[11px] font-ui">
          <span className="w-3.5 h-3.5 rounded bg-[#8A6FD1] border border-[var(--ink)]" />
          <span>സാധാരണ പായൽ (Patch)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-ui">
          <span className="w-3.5 h-3.5 rounded bg-[#B4532F] border border-[var(--ink)]" />
          <span>കനാൽ തടസ്സം (Choke Point)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-ui">
          <span className="w-3.5 h-3.5 rounded-full bg-[#1F6B57] border-2 border-white" />
          <span>ശേഖരണ വള്ളം ({selectedCrewId})</span>
        </div>
      </div>

      {/* Patch Details BottomSheet */}
      <BottomSheet
        isOpen={!!selectedPatch}
        onClose={() => setSelectedPatch(null)}
        title={selectedPatch?.name || 'പായൽ വിവരങ്ങൾ'}
        subtitle={`വേമ്പനാട്ട് കായൽ · സെന്റിനൽ-1 SAR വഴി കണ്ടെത്തിയത്`}
      >
        {selectedPatch && (
          <div className="space-y-4">
            {/* Stamp Animation */}
            <div className="flex items-center justify-between bg-[var(--paper-2)] p-3 rounded-xl border border-[var(--ink)]/30">
              <div>
                <span className="text-[10px] font-mono text-[var(--ink-soft)] uppercase block">
                  സാറ്റലൈറ്റ് പരിശോധന നില
                </span>
                <span className="font-display font-bold text-sm text-[var(--ink)]">
                  Sentinel-1 SAR Detection Confirmed
                </span>
              </div>
              <div className="transform -rotate-6 transition-transform">
                <Stamp type="verified" size="md" />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-ui">
              <div className="p-3 bg-[var(--paper-2)] rounded-xl border border-[var(--ink)]/20">
                <span className="text-[10px] text-[var(--ink-soft)] block">തടസ്സ തോത് (Choke Score):</span>
                <b className="font-display text-lg text-[var(--laterite)]">
                  {(selectedPatch.choke_score * 100).toFixed(0)}%
                </b>
              </div>
              <div className="p-3 bg-[var(--paper-2)] rounded-xl border border-[var(--ink)]/20">
                <span className="text-[10px] text-[var(--ink-soft)] block">വിസ്തീർണ്ണം (Area):</span>
                <b className="font-mono text-lg text-[var(--ink)]">
                  {selectedPatch.area_sqm.toLocaleString()} m²
                </b>
              </div>
              <div className="p-3 bg-[var(--paper-2)] rounded-xl border border-[var(--ink)]/20">
                <span className="text-[10px] text-[var(--ink-soft)] block">കണക്കാക്കിയ ഭാരം (Biomass):</span>
                <b className="font-display text-lg text-[var(--backwater)]">
                  {(selectedPatch.biomass_est_kg / 1000).toFixed(1)} tons
                </b>
              </div>
              <div className="p-3 bg-[var(--paper-2)] rounded-xl border border-[var(--ink)]/20">
                <span className="text-[10px] text-[var(--ink-soft)] block">അടുത്തുള്ള ജെട്ടി (Jetty):</span>
                <b className="font-ui text-xs text-[var(--ink)] block truncate">
                  {selectedPatch.nearest_jetty}
                </b>
              </div>
            </div>

            {/* Action to Verify via Photo */}
            {onVerifyPhoto && (
              <div className="pt-2">
                <InkButton
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    const p = selectedPatch;
                    setSelectedPatch(null);
                    onVerifyPhoto(p.id, p.name);
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <IconCamera size={18} />
                    <span>ഫോട്ടോ വഴി ശേഖരണം സ്ഥിരീകരിക്കുക (Verify Photo)</span>
                  </span>
                </InkButton>
              </div>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
