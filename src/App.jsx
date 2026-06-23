import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import MapCanvas from './components/MapCanvas'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import BottomPanel from './components/BottomPanel'
import Login from './components/Login'
import SettingsModal from './components/SettingsModal'
import NotificationsModal from './components/NotificationsModal'
import { AI_ALERTS } from './data/mockData'
import { supabase } from './lib/supabaseClient'

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

  // User state
  const [user, setUser] = useState(null)

  // Autologin and session state listener
  useEffect(() => {
    // 1. Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username || session.user.email.split('@')[0],
        })
      }
    })

    // 2. Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username || session.user.email.split('@')[0],
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Settings & Notifications state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [alerts, setAlerts] = useState(AI_ALERTS)
  const [settings, setSettings] = useState({
    unit: 'C',
    confidenceThreshold: 85,
    overlayOpacity: 80,
  })

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const handleDismissAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }, [])

  const handleResolveAlert = useCallback((id) => {
    setAlerts(prev => prev.map(a => 
      a.id === id 
        ? { ...a, severity: 'success', yieldRisk: 'None', message: `RESOLVED: ${a.message.replace('RESOLVED: ', '')}`, recommendation: '✅ Resolved' }
        : a
    ))
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
        alertCount={alerts.filter(a => a.severity !== 'success').length}
        onToggleNotifications={() => setIsNotificationsOpen(o => !o)}
        onToggleSettings={() => setIsSettingsOpen(o => !o)}
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
            overlayOpacity={settings.overlayOpacity}
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

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={alerts}
        onDismissAlert={handleDismissAlert}
        onResolveAlert={handleResolveAlert}
      />
    </div>
  )
}
