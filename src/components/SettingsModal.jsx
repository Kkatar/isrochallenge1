import { X, Sliders, Thermometer, ShieldAlert, Layers } from 'lucide-react'

export default function SettingsModal({ isOpen, onClose, settings, onSettingsChange }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md p-6 glass border border-white/10 rounded-2xl shadow-glass-lg relative mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-white">
            <Sliders size={18} className="text-neon-green" />
            <h2 className="text-base font-bold">Platform Settings</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form Settings */}
        <div className="space-y-6">
          {/* Temperature Unit */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
              <Thermometer size={14} className="text-neon-sar" />
              <span>Temperature Metric</span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/35 border border-white/5">
              <button
                onClick={() => onSettingsChange({ ...settings, unit: 'C' })}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  settings.unit === 'C' ? 'bg-neon-green text-black shadow-neon' : 'text-gray-400 hover:text-white'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => onSettingsChange({ ...settings, unit: 'F' })}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  settings.unit === 'F' ? 'bg-neon-green text-black shadow-neon' : 'text-gray-400 hover:text-white'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* AI Confidence Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
              <div className="flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-neon-amber" />
                <span>AI Confidence Filter</span>
              </div>
              <span className="font-mono text-neon-amber">{settings.confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min={70}
              max={95}
              value={settings.confidenceThreshold}
              onChange={(e) => onSettingsChange({ ...settings, confidenceThreshold: parseInt(e.target.value) })}
              className="w-full accent-neon-amber bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>70% (High Yield)</span>
              <span>95% (High Precision)</span>
            </div>
          </div>

          {/* Overlay Opacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
              <div className="flex items-center gap-1.5">
                <Layers size={14} className="text-neon-green" />
                <span>Satellite Layer Opacity</span>
              </div>
              <span className="font-mono text-neon-green">{settings.overlayOpacity}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={settings.overlayOpacity}
              onChange={(e) => onSettingsChange({ ...settings, overlayOpacity: parseInt(e.target.value) })}
              className="w-full accent-neon-green bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>20%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full mt-8 py-2.5 rounded-xl text-xs font-bold text-black bg-neon-green hover:bg-[#00e676] shadow-neon transition-all duration-200"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
