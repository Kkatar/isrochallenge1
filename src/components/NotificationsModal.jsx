import { X, Bell, Check, Trash2, AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react'

export default function NotificationsModal({ isOpen, onClose, alerts, onDismissAlert, onResolveAlert }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md p-6 glass border border-white/10 rounded-2xl shadow-glass-lg relative mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 text-white">
            <Bell size={18} className="text-neon-green" />
            <h2 className="text-base font-bold">AI Decision Engine Alerts</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mb-3">
                <ShieldCheck className="text-neon-green" size={24} />
              </div>
              <span className="text-xs font-semibold text-gray-200">System Fully Stable</span>
              <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">No active critical alerts or stress levels detected in any sectors.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const cfg = {
                critical: { bg: 'rgba(255,68,68,0.06)', border: 'rgba(255,68,68,0.2)', text: '#ff4444', icon: AlertCircle },
                warning: { bg: 'rgba(255,179,0,0.06)', border: 'rgba(255,179,0,0.2)', text: '#ffb300', icon: AlertTriangle },
                success: { bg: 'rgba(0,255,136,0.06)', border: 'rgba(0,255,136,0.2)', text: '#00ff88', icon: ShieldCheck }
              }[alert.severity]

              const Icon = cfg.icon

              return (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl border flex flex-col gap-2 transition-all duration-200"
                  style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-white/5">
                        <Icon size={14} style={{ color: cfg.text }} />
                      </span>
                      <span className="text-xs font-bold" style={{ color: cfg.text }}>
                        {alert.sector}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {alert.cropStage}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {alert.timestamp.split(' ')[1]}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">Yield Impact</span>
                      <span className="text-xs font-bold font-mono" style={{ color: alert.yieldRisk === 'None' ? '#00ff88' : '#ff4444' }}>
                        {alert.yieldRisk}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {alert.severity !== 'success' && (
                        <button
                          onClick={() => onResolveAlert(alert.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-black bg-neon-green hover:bg-[#00e676] transition-colors"
                        >
                          <Check size={10} /> Resolve
                        </button>
                      )}
                      <button
                        onClick={() => onDismissAlert(alert.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                        title="Dismiss"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center flex-shrink-0">
          <span className="text-[10px] text-gray-500">
            Total active alerts: <span className="font-bold text-gray-300 font-mono">{alerts.length}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
