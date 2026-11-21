import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { PatchCollection } from '../types';

interface MapViewProps {
  patches: PatchCollection | null;
  selectedCrewId: string;
}

export const MapView: React.FC<MapViewProps> = ({ patches }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize MapLibre GL
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
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

    const onLoadOrReady = () => {
      // Split into polygons (patches) and points (boats)
      const patchFeatures = patches.features.filter(
        (f) => f.geometry.type === 'Polygon'
      );
      const boatFeatures = patches.features.filter(
        (f) => f.geometry.type === 'Point'
      );

      // 1. Update Hyacinth Patches
      if (map.getSource('hyacinth-patches')) {
        (map.getSource('hyacinth-patches') as maplibregl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: patchFeatures as any
        });
      } else {
        map.addSource('hyacinth-patches', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: patchFeatures as any
          }
        });

        // Patch fill
        map.addLayer({
          id: 'patch-fills',
          type: 'fill',
          source: 'hyacinth-patches',
          paint: {
            'fill-color': [
              'step',
              ['get', 'choke_score'],
              '#eab308', // Low choke: yellow
              0.70, '#f97316', // Medium: orange
              0.85, '#ef4444'  // High choke: red
            ],
            'fill-opacity': 0.65
          }
        });

        // Patch border
        map.addLayer({
          id: 'patch-borders',
          type: 'line',
          source: 'hyacinth-patches',
          paint: {
            'line-color': '#ffffff',
            'line-width': 2
          }
        });

        // Popup on click
        map.on('click', 'patch-fills', (e) => {
          if (!e.features || !e.features[0]) return;
          const props = e.features[0].properties as any;
          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="color: #0f172a; font-family: sans-serif; padding: 4px;">
                <h4 style="margin: 0 0 4px; font-weight: 800;">${props.name}</h4>
                <div style="font-size: 12px; line-height: 1.4;">
                  <div><b>Choke Score:</b> <span style="color: #dc2626; font-weight: bold;">${(props.choke_score * 100).toFixed(0)}%</span></div>
                  <div><b>Area:</b> ${props.area_sqm} m²</div>
                  <div><b>Est. Biomass:</b> ${(props.biomass_est_kg / 1000).toFixed(1)} tons</div>
                  <div><b>Nearest Jetty:</b> ${props.nearest_jetty}</div>
                  <div><b>Growth:</b> ${props.growth_trend}</div>
                </div>
              </div>
            `)
            .addTo(map);
        });
      }

      // 2. Update Boat Markers
      if (map.getSource('boats-source')) {
        (map.getSource('boats-source') as maplibregl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: boatFeatures as any
        });
      } else {
        map.addSource('boats-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: boatFeatures as any
          }
        });

        map.addLayer({
          id: 'boat-markers',
          type: 'circle',
          source: 'boats-source',
          paint: {
            'circle-radius': 9,
            'circle-color': '#10b981',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff'
          }
        });

        map.on('click', 'boat-markers', (e) => {
          if (!e.features || !e.features[0]) return;
          const props = e.features[0].properties as any;
          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="color: #0f172a; font-family: sans-serif; padding: 4px;">
                <h4 style="margin: 0 0 4px; font-weight: 800;">🛶 ${props.crew_name}</h4>
                <div style="font-size: 12px;">
                  <div><b>Type:</b> ${props.boat_type}</div>
                  <div><b>Capacity:</b> ${props.capacity_kg} kg</div>
                  <div style="margin-top: 4px; color: #059669; font-weight: bold;">Active Harvester Crew</div>
                </div>
              </div>
            `)
            .addTo(map);
        });
      }
    };

    if (map.isStyleLoaded()) {
      onLoadOrReady();
    } else {
      map.once('load', onLoadOrReady);
    }
  }, [patches]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5 shadow-xl">
        <div className="font-bold text-white mb-1">Radar Choke Legend (Sentinel-1)</div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-red-500"></span>
          <span className="text-slate-300">High Choke (&gt;85% Route Blockage)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-orange-500"></span>
          <span className="text-slate-300">Moderate Choke (70–85%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-yellow-500"></span>
          <span className="text-slate-300">Low Choke (&lt;70%)</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
          <span className="text-slate-300">Active Country Boat (Vanchi)</span>
        </div>
      </div>
    </div>
  );
};
