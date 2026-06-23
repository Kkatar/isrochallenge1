import { useState } from 'react'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from 'recharts'
import { ChevronRight, ChevronLeft, TrendingUp, Brain, Download, FileJson, AlertTriangle, Droplets } from 'lucide-react'
import { CROP_CLASSIFICATION, PHENO_STAGES, MOISTURE_TIMESERIES, AI_ALERTS, NDVI_TIMESERIES, FARM_ZONES } from '../data/mockData'

function GlassTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'rgba(6,13,31,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'8px 12px', fontSize:11 }}>
      <div style={{ color:'#9ca3af', marginBottom:4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color:p.color, fontFamily:'JetBrains Mono' }}>
          {p.name}: {typeof p.value==='number' ? p.value.toFixed(2) : p.value}
        </div>
      ))}
    </div>
  )
}

function MoistureGauge({ value, label }) {
  const r=36, circ=2*Math.PI*r
  const pct=Math.min(value/100,1)
  const dash=pct*circ*0.75
  const stressColor = value>55?'#00ff88':value>35?'#ffb300':'#ff4444'
  const stressLabel = value>55?'Optimal':value>35?'Mild Stress':'Severe Drought'
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={90} height={70} viewBox="0 0 90 75">
        <circle cx={45} cy={48} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={8}
                strokeDasharray={`${circ*0.75} ${circ*0.25}`} strokeDashoffset={circ*0.125} strokeLinecap="round"/>
        <circle cx={45} cy={48} r={r} fill="none" stroke={stressColor} strokeWidth={8}
                strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={circ*0.125} strokeLinecap="round"
                style={{ transition:'stroke-dasharray 0.8s ease', filter:`drop-shadow(0 0 6px ${stressColor}80)` }}/>
        <text x={45} y={50} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={13} fontWeight="700">{value}%</text>
      </svg>
      <div className="text-center">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-xs font-medium" style={{ color:stressColor }}>{stressLabel}</div>
      </div>
    </div>
  )
}

function PhenoTracker({ stageIndex }) {
  return (
    <div className="relative">
      <div className="absolute top-4 left-4 right-4 h-0.5" style={{ background:'rgba(255,255,255,0.08)' }}/>
      <div className="absolute top-4 left-4 h-0.5 transition-all duration-700"
           style={{ right:`${(1-stageIndex/(PHENO_STAGES.length-1))*(100-8)}%`, background:'linear-gradient(90deg,#00ff88,#00c6ff)', boxShadow:'0 0 8px rgba(0,255,136,0.5)' }}/>
      <div className="flex justify-between px-2">
        {PHENO_STAGES.map((s,i) => {
          const done=i<stageIndex, current=i===stageIndex
          return (
            <div key={s.id} className="flex flex-col items-center gap-1.5 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base ${current?'scale-110':''}`}
                   style={{ background:done?'rgba(0,255,136,0.2)':current?'rgba(0,198,255,0.2)':'rgba(255,255,255,0.05)',
                            border:`1.5px solid ${done?'#00ff88':current?'#00c6ff':'rgba(255,255,255,0.12)'}`,
                            boxShadow:current?'0 0 12px rgba(0,198,255,0.5)':'none' }}>
                {s.icon}
              </div>
              <div className="text-xs font-medium" style={{ color:current?'#00c6ff':done?'#00ff88':'#6b7280' }}>{s.label}</div>
              <div className="text-xs text-gray-600">{s.days}d</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AlertCard({ alert }) {
  const cfg={
    critical:{ color:'#ff4444', bg:'rgba(255,68,68,0.08)',  border:'rgba(255,68,68,0.25)',  icon:'🚨' },
    warning: { color:'#ffb300', bg:'rgba(255,179,0,0.08)',  border:'rgba(255,179,0,0.25)',  icon:'⚠️' },
    success: { color:'#00ff88', bg:'rgba(0,255,136,0.08)',  border:'rgba(0,255,136,0.25)', icon:'✅' },
  }[alert.severity]
  return (
    <div className="p-3 rounded-xl space-y-2 animate-fade-in" style={{ background:cfg.bg, border:`1px solid ${cfg.border}` }}>
      <div className="flex items-start gap-2">
        <span className="text-base flex-shrink-0">{cfg.icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold" style={{ color:cfg.color }}>{alert.sector}</span>
            <span className="text-xs text-gray-400">{alert.cropStage}</span>
          </div>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{alert.message}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div className="text-xs font-medium" style={{ color:cfg.color }}>{alert.recommendation}</div>
          <div className="text-xs text-gray-500">{alert.timeframe}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Yield Risk</div>
          <div className="text-xs font-mono font-bold" style={{ color:alert.yieldRisk==='None'?'#00ff88':'#ff4444' }}>{alert.yieldRisk}</div>
        </div>
      </div>
    </div>
  )
}

export default function RightSidebar({ open, onToggle, selectedZone, timeIndex }) {
  const [activeTab, setActiveTab] = useState('analytics')
  const zone = selectedZone ? FARM_ZONES.features.find(f => f.id === selectedZone.id) : null
  const zp = zone?.properties

  const downloadReport = () => {
    const zoneName = zp?.name || 'All Zones'
    const timestamp = new Date().toLocaleString()
    
    let reportText = `==================================================
              AGROSENSE AI REPORT
==================================================
Report Level: ${zoneName.toUpperCase()}
Generated On: ${timestamp}
System Status: ACTIVE (Optimal)
--------------------------------------------------

`

    if (zp) {
      reportText += `[ ZONE DETAILS: ${zp.name} ]
- Crop Type: ${zp.cropType || 'N/A'}
- Growth Stage: ${zp.stage || 'N/A'}
- Total Area: ${zp.area_ha || '0'} hectares
- Current NDVI (Greenness): ${zp.ndvi || 'N/A'}
- Soil Moisture Index: ${(zp.moisture * 100).toFixed(0)}%
- Projected Yield: ${zp.yield_forecast || 'N/A'} t/ha

[ RECOMMENDATIONS & ANALYSIS ]
- Soil moisture is at ${(zp.moisture * 100).toFixed(0)}%, which indicates ${zp.moisture > 0.55 ? 'optimal irrigation' : zp.moisture > 0.35 ? 'moderate water stress - monitor closely' : 'severe drought stress - immediate irrigation required'}.
- The crop is in the ${zp.stage || 'N/A'} stage. Keep nutrient application synced with phenological phases.`
    } else {
      reportText += `[ GLOBAL SITE SUMMARY ]
- Total Monitored Area: 373.7 ha
- Active Zones: 4
- Average Crop Health (NDVI): 0.72 (Optimal)
- AI Model Confidence: 92.6%
- Active Alerts: 2 Warnings

[ INDIVIDUAL ZONE PROFILES ]\n`
      
      FARM_ZONES.features.forEach((feat, idx) => {
        const p = feat.properties
        reportText += `
Zone ${idx + 1}: ${p.name}
  - Crop: ${p.cropType} (${p.stage})
  - Area: ${p.area_ha} ha
  - NDVI: ${p.ndvi} | Moisture: ${(p.moisture * 100).toFixed(0)}%
  - Yield Forecast: ${p.yield_forecast} t/ha\n`
      })
    }

    reportText += `\n--------------------------------------------------
This report was generated automatically by the AgroSense AI Platform.
==================================================`

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `agrosense-report-${zoneName.toLowerCase().replace(/\s+/g, '-')}.txt`
    a.click()
  }
  const exportGeoJSON = () => {
    const blob=new Blob([JSON.stringify(zone?{type:'FeatureCollection',features:[zone]}:FARM_ZONES,null,2)],{type:'application/geo+json'})
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='agrosense-zones.geojson'; a.click()
  }

  return (
    <aside id="right-sidebar" className={`relative flex-shrink-0 h-full transition-all duration-300 ${open?'w-80':'w-0'}`}>
      <button id="btn-right-toggle" onClick={onToggle}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-50 w-6 h-12 glass rounded-l-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              style={{ border:'1px solid rgba(0,255,136,0.15)', borderRight:'none' }}>
        {open?<ChevronRight size={12} className="text-neon-green"/>:<ChevronLeft size={12} className="text-neon-green"/>}
      </button>

      {open && (
        <div className="h-full glass border-l border-white/5 flex flex-col animate-slide-right overflow-hidden">
          {/* Tabs */}
          <div className="flex" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            {[{id:'analytics',label:'Analytics',icon:TrendingUp},{id:'alerts',label:'AI Insights',icon:Brain}].map(t=>(
              <button key={t.id} id={`tab-${t.id}`} onClick={()=>setActiveTab(t.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all ${activeTab===t.id?'text-neon-green':'text-gray-400 hover:text-gray-200'}`}
                      style={{ borderBottom:activeTab===t.id?'2px solid #00ff88':'2px solid transparent' }}>
                <t.icon size={12}/>{t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            {activeTab==='analytics' && (
              <>
                {zp && (
                  <div className="p-3 rounded-xl animate-fade-in" style={{ background:'rgba(0,255,136,0.06)', border:'1px solid rgba(0,255,136,0.18)' }}>
                    <div className="flex justify-between"><span className="text-xs font-bold text-neon-green">{zp.name}</span><span className="text-xs font-mono text-gray-400">{zp.area_ha} ha</span></div>
                    <div className="text-xs text-gray-300 mt-1">{zp.cropType} · {zp.stage}</div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[{l:'NDVI',v:zp.ndvi,c:'#00ff88'},{l:'Moisture',v:`${(zp.moisture*100).toFixed(0)}%`,c:'#00c6ff'},{l:'Yield',v:`${zp.yield_forecast}t/ha`,c:'#ffb300'}].map(m=>(
                        <div key={m.l} className="text-center p-1.5 rounded-lg" style={{ background:'rgba(255,255,255,0.04)' }}>
                          <div className="text-xs font-mono font-bold" style={{ color:m.c }}>{m.v}</div>
                          <div className="text-xs text-gray-500">{m.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crop classification */}
                <div className="rounded-xl p-3 space-y-2" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2"><div className="w-1 h-4 rounded-full" style={{ background:'#00ff88' }}/><span className="text-xs font-semibold text-white">Crop Classification</span></div>
                  <div className="flex items-center gap-2">
                    <ResponsiveContainer width={110} height={110}>
                      <PieChart><Pie data={CROP_CLASSIFICATION} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={48} paddingAngle={3} strokeWidth={0}>
                        {CROP_CLASSIFICATION.map(e=><Cell key={e.name} fill={e.color} style={{ filter:`drop-shadow(0 0 4px ${e.color}60)` }}/>)}
                      </Pie><Tooltip content={<GlassTooltip/>}/></PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-1.5">
                      {CROP_CLASSIFICATION.map(c=>(
                        <div key={c.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background:c.color }}/><span className="text-xs text-gray-300">{c.name}</span></div>
                          <div className="text-right"><span className="text-xs font-mono font-medium text-white">{c.value}%</span><div className="text-xs text-gray-600">{c.confidence}%</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pheno tracker */}
                <div className="rounded-xl p-3 space-y-3" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2"><div className="w-1 h-4 rounded-full" style={{ background:'#00c6ff' }}/><span className="text-xs font-semibold text-white">Phenological Stage</span>
                    {zp && <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background:'rgba(0,198,255,0.1)', color:'#00c6ff', border:'1px solid rgba(0,198,255,0.2)' }}>{zp.stage}</span>}
                  </div>
                  <PhenoTracker stageIndex={zp?.stageIndex??1}/>
                </div>

                {/* Moisture gauges */}
                <div className="rounded-xl p-3" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background:'#ffb300' }}/><span className="text-xs font-semibold text-white">Moisture Stress Index</span><Droplets size={11} className="ml-auto" style={{ color:'#00c6ff' }}/></div>
                  <div className="flex justify-around"><MoistureGauge value={68} label="Sector A"/><MoistureGauge value={31} label="Sector B"/><MoistureGauge value={52} label="Sector C"/></div>
                </div>

                {/* NDVI chart */}
                <div className="rounded-xl p-3" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 rounded-full" style={{ background:'#a855f7' }}/><span className="text-xs font-semibold text-white">NDVI Trend</span></div>
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={NDVI_TIMESERIES.slice(0,Math.max(timeIndex+1,2))} margin={{ top:4, right:4, left:-24, bottom:0 }}>
                      <defs>
                        <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/><stop offset="95%" stopColor="#00ff88" stopOpacity={0}/></linearGradient>
                        <linearGradient id="wG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00c6ff" stopOpacity={0.3}/><stop offset="95%" stopColor="#00c6ff" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                      <XAxis dataKey="date" tick={{ fill:'#6b7280', fontSize:9 }} interval={3}/>
                      <YAxis tick={{ fill:'#6b7280', fontSize:9 }} domain={[0,1]}/>
                      <Tooltip content={<GlassTooltip/>}/>
                      <Area type="monotone" dataKey="rice"   name="Rice"   stroke="#00ff88" fill="url(#rG)" strokeWidth={1.5} dot={false}/>
                      <Area type="monotone" dataKey="wheat"  name="Wheat"  stroke="#00c6ff" fill="url(#wG)" strokeWidth={1.5} dot={false}/>
                      <Area type="monotone" dataKey="cotton" name="Cotton" stroke="#ffb300" fill="none"     strokeWidth={1.5} dot={false}/>
                      <Area type="monotone" dataKey="maize"  name="Maize"  stroke="#a855f7" fill="none"     strokeWidth={1.5} dot={false}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-2">
                  {[{l:'Total Area',v:'373.7 ha',s:'4 zones',c:'#00ff88'},{l:'Avg Confidence',v:'92.6%',s:'AI model',c:'#00c6ff'},{l:'Yield Forecast',v:'3.9 t/ha',s:'Season avg',c:'#ffb300'},{l:'Alert Count',v:'2 Active',s:'1 Critical',c:'#ff4444'}].map(k=>(
                    <div key={k.l} className="p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                      <div className="text-xs font-mono font-bold" style={{ color:k.c }}>{k.v}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{k.l}</div>
                      <div className="text-xs text-gray-600">{k.s}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab==='alerts' && (
              <>
                <div className="flex items-center gap-2 px-1"><AlertTriangle size={13} className="text-amber-400"/><span className="text-xs font-semibold text-gray-300">AI Irrigation Decision Engine</span></div>
                <div className="space-y-3">{AI_ALERTS.map(a=><AlertCard key={a.id} alert={a}/>)}</div>
                <div className="rounded-xl p-3" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-xs font-semibold text-white mb-3">Soil Moisture (24h)</div>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={MOISTURE_TIMESERIES} margin={{ top:4, right:4, left:-24, bottom:0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                      <XAxis dataKey="time" tick={{ fill:'#6b7280', fontSize:9 }}/>
                      <YAxis tick={{ fill:'#6b7280', fontSize:9 }} domain={[20,80]}/>
                      <Tooltip content={<GlassTooltip/>}/>
                      <Line type="monotone" dataKey="sector_a" name="Sector A" stroke="#00ff88" strokeWidth={1.5} dot={false}/>
                      <Line type="monotone" dataKey="sector_b" name="Sector B" stroke="#ff4444" strokeWidth={1.5} dot={false} strokeDasharray="4 2"/>
                      <Line type="monotone" dataKey="sector_c" name="Sector C" stroke="#ffb300" strokeWidth={1.5} dot={false}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="px-3 pb-3 pt-3 space-y-2" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <button id="btn-download-report" onClick={downloadReport}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
                    style={{ background:'linear-gradient(135deg,rgba(0,255,136,0.2),rgba(0,198,255,0.2))', border:'1px solid rgba(0,255,136,0.3)' }}>
              <Download size={13}/>Download Report
            </button>
            <button id="btn-export-geojson" onClick={exportGeoJSON}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-gray-300 transition-all hover:text-white hover:scale-[1.02]"
                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
              <FileJson size={13}/>Export GeoJSON
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
