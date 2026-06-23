import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { FARM_ZONES } from '../data/mockData'

// Fix Leaflet's broken default icon URLs when bundled with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Agricultural region — Nashik, Maharashtra, India
const CENTER = [19.97, 73.82]
const ZOOM   = 13

/* ─── Tile layer URLs ──────────────────────────────────────────── */
const TILE_URLS = {
  optical: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  sar:     'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  fused:   'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
}

/* ─── Zone styling ─────────────────────────────────────────────── */
function getZoneStyle(props, activeLayer, isSelected) {
  const colorMap = {
    optical: { 'Optimal':'#00ff88', 'Mild Stress':'#ffb300', 'Severe Drought':'#ff4444' },
    sar:     { 'Optimal':'#00c6ff', 'Mild Stress':'#0088ff', 'Severe Drought':'#6600ff' },
    fused:   { 'Optimal':'#00ff88', 'Mild Stress':'#ffb300', 'Severe Drought':'#ff4444' },
  }
  const color = (colorMap[activeLayer] || colorMap.fused)[props.stressLevel] || '#00ff88'
  return {
    fillColor:   color,
    fillOpacity: isSelected ? 0.45 : 0.22,
    color,
    weight:      isSelected ? 3 : 2,
    opacity:     0.85,
    dashArray:   activeLayer === 'sar' ? '6 3' : undefined,
  }
}

/* ─── Build tooltip HTML ───────────────────────────────────────── */
function buildTooltip(props) {
  const stressIcon = { 'Optimal':'🟢', 'Mild Stress':'🟡', 'Severe Drought':'🔴' }[props.stressLevel] || '⚪'
  return `
    <div style="background:rgba(6,13,31,0.94);border:1px solid rgba(0,255,136,0.25);border-radius:10px;
                padding:10px 14px;font-family:Inter,sans-serif;min-width:170px;backdrop-filter:blur(12px);">
      <div style="color:#fff;font-weight:700;font-size:12px;margin-bottom:5px">${props.name}</div>
      <div style="color:#00ff88;font-size:11px;margin-bottom:3px">🌾 ${props.cropType} — ${props.confidence}% conf.</div>
      <div style="color:#e2e8f0;font-size:11px">${stressIcon} ${props.stressLevel}</div>
      <div style="color:#9ca3af;font-size:10px;margin-top:5px;display:flex;gap:8px">
        <span>NDVI: <b style="color:#fff">${props.ndvi}</b></span>
        <span>Moisture: <b style="color:#00c6ff">${(props.moisture * 100).toFixed(0)}%</b></span>
      </div>
      <div style="color:#9ca3af;font-size:10px;margin-top:3px">${props.area_ha} ha · Yield: ${props.yield_forecast} t/ha</div>
    </div>
  `
}

/**
 * MapCanvas — pure Leaflet JS (no react-leaflet) for maximum compatibility.
 * Renders a full-screen map with switchable tile layers and GeoJSON farm zones.
 */
export default function MapCanvas({ activeLayer, selectedZone, onZoneSelect, drawMode, timeIndex }) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const tileRef      = useRef(null)
  const geoRef       = useRef(null)
  const drawRef      = useRef({ points: [], poly: null, markers: [] })

  /* ── Initialize map once ──────────────────────────────────────── */
  useEffect(() => {
    if (mapRef.current) return // already initialized

    const map = L.map(containerRef.current, {
      center:     CENTER,
      zoom:       ZOOM,
      zoomControl: true,
    })
    mapRef.current = map

    // Initial tile layer
    tileRef.current = L.tileLayer(TILE_URLS.fused, {
      attribution: '© CartoDB | AgroSense AI Platform',
      subdomains:  'abcd',
      maxZoom:     20,
    }).addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  /* ── Swap tile layer when activeLayer changes ─────────────────── */
  useEffect(() => {
    if (!mapRef.current) return
    if (tileRef.current) {
      mapRef.current.removeLayer(tileRef.current)
    }
    tileRef.current = L.tileLayer(TILE_URLS[activeLayer] || TILE_URLS.fused, {
      attribution: '© CartoDB / ESRI | AgroSense AI Platform',
      subdomains:  'abcd',
      maxZoom:     20,
    }).addTo(mapRef.current)
  }, [activeLayer])

  /* ── Re-render GeoJSON layer when layer or selection changes ──── */
  useEffect(() => {
    if (!mapRef.current) return

    // Remove old GeoJSON layer
    if (geoRef.current) {
      mapRef.current.removeLayer(geoRef.current)
    }

    const layer = L.geoJSON(FARM_ZONES, {
      style: feature => getZoneStyle(feature.properties, activeLayer,
        selectedZone && feature.id === selectedZone.id),
      onEachFeature: (feature, lyr) => {
        const props = feature.properties

        // Tooltip
        lyr.bindTooltip(buildTooltip(props), {
          sticky:    true,
          opacity:   1,
          className: 'leaflet-glass-tooltip',
        })

        // Click → select zone
        lyr.on('click', () => onZoneSelect(feature))

        // Hover highlight
        lyr.on('mouseover', () => {
          lyr.setStyle({ weight: 3, fillOpacity: 0.42 })
        })
        lyr.on('mouseout', () => {
          const isSel = selectedZone && feature.id === selectedZone.id
          lyr.setStyle(getZoneStyle(props, activeLayer, isSel))
        })
      },
    }).addTo(mapRef.current)

    geoRef.current = layer
  }, [activeLayer, selectedZone, onZoneSelect])

  /* ── Draw mode cursor ─────────────────────────────────────────── */
  useEffect(() => {
    if (!mapRef.current) return
    const c = mapRef.current.getContainer()
    c.style.cursor = drawMode ? 'crosshair' : ''
  }, [drawMode])

  return (
    <div id="map-canvas" className="absolute inset-0 z-0">
      {/* Leaflet mount target */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Active layer badge */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
        <div className="glass flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
             style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: activeLayer==='optical'?'#00ff88':activeLayer==='sar'?'#00c6ff':'#ffb300' }}/>
          <span className="text-gray-300 font-medium">
            {activeLayer==='optical' && 'Optical — Sentinel-2 + Landsat + LISS-IV'}
            {activeLayer==='sar'     && 'Microwave SAR — Sentinel-1 + NISAR'}
            {activeLayer==='fused'   && 'AI Fused — Optical + SAR Multi-Source'}
          </span>
        </div>
      </div>

      {/* Draw mode indicator */}
      {drawMode && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[500]">
          <div className="glass px-4 py-2 rounded-xl text-xs text-amber-300"
               style={{ border:'1px solid rgba(255,179,0,0.3)' }}>
            ✏️ Draw mode active — click on map to mark farm boundary
          </div>
        </div>
      )}

      {/* Zone legend */}
      <div className="absolute bottom-28 right-4 z-[500]">
        <div className="glass p-3 rounded-xl text-xs space-y-1.5"
             style={{ border:'1px solid rgba(255,255,255,0.07)', minWidth:130 }}>
          <div className="text-gray-400 font-medium mb-2">Zone Legend</div>
          {[
            { label:'Optimal',        color:'#00ff88' },
            { label:'Mild Stress',    color:'#ffb300' },
            { label:'Severe Drought', color:'#ff4444' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <span className="w-3 h-2 rounded-sm flex-shrink-0" style={{ background:l.color, opacity:0.7 }}/>
              <span className="text-gray-300">{l.label}</span>
            </div>
          ))}
          <div className="pt-1 mt-1" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-gray-500" style={{ fontSize:9 }}>Click zone to inspect</div>
          </div>
        </div>
      </div>
    </div>
  )
}
