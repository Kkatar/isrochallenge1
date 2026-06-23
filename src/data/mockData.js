// ─── Mock GeoJSON & Satellite Data ──────────────────────────────
// Simulated agricultural zones around Nashik, Maharashtra, India

export const FARM_ZONES = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'zone-A',
      properties: {
        name: 'Sector A — Rice Belt',
        cropType: 'Rice',
        confidence: 94.2,
        stage: 'Vegetative',
        stageIndex: 1,
        ndvi: 0.72,
        moisture: 0.68,
        stressLevel: 'Optimal',
        area_ha: 142.5,
        yield_forecast: 4.8,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.780, 20.005], [73.820, 20.005],
          [73.820, 19.975], [73.780, 19.975], [73.780, 20.005],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'zone-B',
      properties: {
        name: 'Sector B — Wheat Fields',
        cropType: 'Wheat',
        confidence: 91.7,
        stage: 'Flowering',
        stageIndex: 2,
        ndvi: 0.61,
        moisture: 0.31,
        stressLevel: 'Severe Drought',
        area_ha: 98.3,
        yield_forecast: 3.1,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.830, 20.010], [73.870, 20.010],
          [73.870, 19.985], [73.830, 19.985], [73.830, 20.010],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'zone-C',
      properties: {
        name: 'Sector C — Cotton Zone',
        cropType: 'Cotton',
        confidence: 88.4,
        stage: 'Emergence',
        stageIndex: 0,
        ndvi: 0.44,
        moisture: 0.52,
        stressLevel: 'Mild Stress',
        area_ha: 77.1,
        yield_forecast: 2.6,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.760, 19.960], [73.800, 19.960],
          [73.800, 19.935], [73.760, 19.935], [73.760, 19.960],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'zone-D',
      properties: {
        name: 'Sector D — Maize Block',
        cropType: 'Maize',
        confidence: 96.1,
        stage: 'Senescence',
        stageIndex: 3,
        ndvi: 0.35,
        moisture: 0.28,
        stressLevel: 'Mild Stress',
        area_ha: 55.8,
        yield_forecast: 5.2,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.840, 19.960], [73.880, 19.960],
          [73.880, 19.935], [73.840, 19.935], [73.840, 19.960],
        ]],
      },
    },
  ],
}

// Time-series NDVI data (simulated weekly averages)
export const NDVI_TIMESERIES = [
  { date: 'Jan W1', rice: 0.12, wheat: 0.41, cotton: 0.08, maize: 0.60 },
  { date: 'Jan W3', rice: 0.18, wheat: 0.55, cotton: 0.11, maize: 0.52 },
  { date: 'Feb W1', rice: 0.25, wheat: 0.68, cotton: 0.14, maize: 0.41 },
  { date: 'Feb W3', rice: 0.38, wheat: 0.72, cotton: 0.19, maize: 0.33 },
  { date: 'Mar W1', rice: 0.52, wheat: 0.65, cotton: 0.28, maize: 0.27 },
  { date: 'Mar W3', rice: 0.67, wheat: 0.55, cotton: 0.42, maize: 0.22 },
  { date: 'Apr W1', rice: 0.72, wheat: 0.44, cotton: 0.58, maize: 0.18 },
  { date: 'Apr W3', rice: 0.70, wheat: 0.32, cotton: 0.65, maize: 0.14 },
  { date: 'May W1', rice: 0.65, wheat: 0.21, cotton: 0.61, maize: 0.35 },
  { date: 'May W3', rice: 0.58, wheat: 0.15, cotton: 0.55, maize: 0.48 },
  { date: 'Jun W1', rice: 0.48, wheat: 0.10, cotton: 0.44, maize: 0.62 },
  { date: 'Jun W3', rice: 0.35, wheat: 0.08, cotton: 0.31, maize: 0.71 },
]

// Crop classification breakdown
export const CROP_CLASSIFICATION = [
  { name: 'Rice',   value: 35.4, confidence: 94.2, color: '#00ff88' },
  { name: 'Wheat',  value: 24.6, confidence: 91.7, color: '#00c6ff' },
  { name: 'Cotton', value: 22.1, confidence: 88.4, color: '#ffb300' },
  { name: 'Maize',  value: 17.9, confidence: 96.1, color: '#a855f7' },
]

// Phenological stages
export const PHENO_STAGES = [
  { id: 0, label: 'Emergence',  icon: '🌱', days: '0–14'   },
  { id: 1, label: 'Vegetative', icon: '🌿', days: '15–45'  },
  { id: 2, label: 'Flowering',  icon: '🌾', days: '46–75'  },
  { id: 3, label: 'Senescence', icon: '🍂', days: '76–100' },
]

// Soil moisture time-series (%)
export const MOISTURE_TIMESERIES = [
  { time: '00:00', sector_a: 72, sector_b: 38, sector_c: 55 },
  { time: '03:00', sector_a: 70, sector_b: 35, sector_c: 53 },
  { time: '06:00', sector_a: 68, sector_b: 34, sector_c: 51 },
  { time: '09:00', sector_a: 65, sector_b: 31, sector_c: 49 },
  { time: '12:00', sector_a: 61, sector_b: 28, sector_c: 46 },
  { time: '15:00', sector_a: 58, sector_b: 26, sector_c: 43 },
  { time: '18:00', sector_a: 62, sector_b: 30, sector_c: 47 },
  { time: '21:00', sector_a: 67, sector_b: 33, sector_c: 52 },
]

// AI Irrigation alerts
export const AI_ALERTS = [
  {
    id: 1,
    severity: 'critical',
    sector: 'Sector B',
    cropStage: 'Flowering Stage',
    message: 'Severe Moisture Stress detected in Sector B (Wheat — Flowering Stage). Action Required: Deploy 15mm irrigation within the next 12 hours to prevent 8% yield loss.',
    recommendation: '💧 Deploy 15mm irrigation',
    timeframe: 'Within 12 hours',
    yieldRisk: '−8%',
    timestamp: '2026-06-23 10:45 IST',
  },
  {
    id: 2,
    severity: 'warning',
    sector: 'Sector C',
    cropStage: 'Emergence Stage',
    message: 'Mild Stress detected in Sector C (Cotton — Emergence). Consider 8mm supplemental irrigation in the next 24–36 hours.',
    recommendation: '💧 Apply 8mm irrigation',
    timeframe: 'Within 36 hours',
    yieldRisk: '−3%',
    timestamp: '2026-06-23 09:12 IST',
  },
  {
    id: 3,
    severity: 'success',
    sector: 'Sector A',
    cropStage: 'Vegetative Stage',
    message: 'Sector A (Rice — Vegetative) is at optimal moisture levels. No irrigation required. Continue monitoring.',
    recommendation: '✅ No action needed',
    timeframe: 'Next review: 48h',
    yieldRisk: 'None',
    timestamp: '2026-06-23 08:00 IST',
  },
]

// Satellite sources
export const SAT_SOURCES = [
  { id: 'sentinel2',  label: 'Sentinel-2',  type: 'optical', band: '10m MSI' },
  { id: 'landsat',    label: 'Landsat-9',   type: 'optical', band: '30m OLI' },
  { id: 'liss4',      label: 'LISS-IV',     type: 'optical', band: '5.8m' },
  { id: 'sentinel1',  label: 'Sentinel-1',  type: 'sar',     band: 'C-band SAR' },
  { id: 'nisar',      label: 'NISAR',       type: 'sar',     band: 'L+S dual-band' },
]

// Timeline date steps
export const TIMELINE_DATES = [
  'Jan 1', 'Jan 15', 'Feb 1', 'Feb 15', 'Mar 1', 'Mar 15',
  'Apr 1', 'Apr 15', 'May 1', 'May 15', 'Jun 1', 'Jun 15', 'Jun 23',
]
