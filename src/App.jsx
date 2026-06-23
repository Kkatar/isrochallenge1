import { useState, useCallback } from 'react'
import Header from './components/Header'
import MapCanvas from './components/MapCanvas'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import BottomPanel from './components/BottomPanel'
import Login from './components/Login'

/**
 * Root application component.
 * Manages shared state: active layer, selected zone, time index, sidebar visibility.
 */
export default function App() {
  // Active satellite layer: 'optical' | 'sar' | 'fused'
  const [activeLayer, setActiveLayer] = useState('fused')

  // Currently selected farm zone feature (from GeoJSON click)
  const [selectedZone, setSelectedZone] = useState(null)

  // Timeline step index (0 = Jan 1, last = today)
  const [timeIndex, setTimeIndex] = useState(12)

  // Sidebar collapse state
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)

  // Active satellite sensor filters
  const [activeSensors, setActiveSensors] = useState(['sentinel2', 'sentinel1'])

  // Drawing mode (polygon tool)
  const [drawMode, setDrawMode] = useState(false)

  // User state (restores from localStorage if present)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agrosense_current_user')
    return saved ? JSON.parse(saved) : null
  })

  const handleLogout = useCallback(() => {
    localStorage.removeItem('agrosense_current_user')
    setUser(null)
  }, [])

  const handleZoneSelect = useCallback((zone) => {
    setSelectedZone(zone)
    if (!rightOpen) setRightOpen(true)
  }, [rightOpen])

  const toggleSensor = useCallback((sensorId) => {
    setActiveSensors(prev =>
      prev.includes(sensorId)
        ? prev.filter(s => s !== sensorId)
        : [...prev, sensorId]
    )
  }, [])

  if (!user) {
    return <Login onLoginSuccess={setUser} />
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-animated">
      {/* Top navigation bar */}
      <Header
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
        drawMode={drawMode}
        onToggleDrawMode={() => setDrawMode(d => !d)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main layout grid (below header) */}
      <div className="absolute inset-0 top-14 flex">
        {/* Left sidebar */}
        <LeftSidebar
          open={leftOpen}
          onToggle={() => setLeftOpen(o => !o)}
          activeLayer={activeLayer}
          activeSensors={activeSensors}
          onSensorToggle={toggleSensor}
          timeIndex={timeIndex}
        />

        {/* Map canvas (fills remaining width) */}
        <div className="flex-1 relative overflow-hidden">
          <MapCanvas
            activeLayer={activeLayer}
            selectedZone={selectedZone}
            onZoneSelect={handleZoneSelect}
            drawMode={drawMode}
            timeIndex={timeIndex}
          />

          {/* Bottom timeline panel */}
          <BottomPanel
            timeIndex={timeIndex}
            onTimeChange={setTimeIndex}
            selectedZone={selectedZone}
          />
        </div>

        {/* Right sidebar */}
        <RightSidebar
          open={rightOpen}
          onToggle={() => setRightOpen(o => !o)}
          selectedZone={selectedZone}
          timeIndex={timeIndex}
        />
      </div>
    </div>
  )
}
