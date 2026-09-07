export type District = {
  id: string
  name: string
  hi: string
  pop: number
  lit: number
  pci: number
  tourists: number
  health: number
  schools: number
  rain: number
  closed: number
  alerts: number
  mig: number
  ghosts: number
  net: number
  ind: string
}

export const DISTRICTS: District[] = [
  { id: 'uttarkashi', name: 'Uttarkashi', hi: 'उत्तरकाशी', pop: 330086, lit: 75.81, pci: 118000, tourists: 62, health: 96, schools: 1104, rain: 128, closed: 6, alerts: 4, mig: 74, ghosts: 38, net: 6.2, ind: 'Horticulture, pilgrimage services' },
  { id: 'chamoli', name: 'Chamoli', hi: 'चमोली', pop: 391605, lit: 82.65, pci: 126000, tourists: 81, health: 112, schools: 1287, rain: 141, closed: 8, alerts: 5, mig: 88, ghosts: 46, net: 5.4, ind: 'Pilgrimage services, hydropower' },
  { id: 'rudraprayag', name: 'Rudraprayag', hi: 'रुद्रप्रयाग', pop: 242285, lit: 81.3, pci: 114000, tourists: 88, health: 78, schools: 842, rain: 117, closed: 4, alerts: 3, mig: 69, ghosts: 29, net: 7.1, ind: 'Pilgrimage services, agriculture' },
  { id: 'tehri', name: 'Tehri Garhwal', hi: 'टिहरी गढ़वाल', pop: 618931, lit: 76.36, pci: 121000, tourists: 41, health: 141, schools: 1832, rain: 96, closed: 3, alerts: 2, mig: 81, ghosts: 52, net: 9.8, ind: 'Hydropower, horticulture, tourism' },
  { id: 'dehradun', name: 'Dehradun', hi: 'देहरादून', pop: 1696694, lit: 84.25, pci: 262000, tourists: 57, health: 388, schools: 2611, rain: 88, closed: 2, alerts: 1, mig: 12, ghosts: 4, net: 38.6, ind: 'IT, education, pharma, tourism' },
  { id: 'pauri', name: 'Pauri Garhwal', hi: 'पौड़ी गढ़वाल', pop: 687271, lit: 82.02, pci: 132000, tourists: 34, health: 168, schools: 2094, rain: 79, closed: 5, alerts: 2, mig: 92, ghosts: 186, net: 8.4, ind: 'Agriculture, services' },
  { id: 'haridwar', name: 'Haridwar', hi: 'हरिद्वार', pop: 1890422, lit: 73.43, pci: 214000, tourists: 74, health: 342, schools: 2418, rain: 61, closed: 1, alerts: 2, mig: 9, ghosts: 2, net: 31.2, ind: 'Manufacturing, pilgrimage, SIDCUL' },
  { id: 'bageshwar', name: 'Bageshwar', hi: 'बागेश्वर', pop: 259898, lit: 80.01, pci: 109000, tourists: 29, health: 74, schools: 912, rain: 104, closed: 3, alerts: 2, mig: 72, ghosts: 31, net: 6.6, ind: 'Agriculture, soapstone' },
  { id: 'almora', name: 'Almora', hi: 'अल्मोड़ा', pop: 622506, lit: 80.47, pci: 118000, tourists: 38, health: 186, schools: 2148, rain: 84, closed: 2, alerts: 1, mig: 86, ghosts: 114, net: 9.1, ind: 'Agriculture, handloom, tourism' },
  { id: 'pithoragarh', name: 'Pithoragarh', hi: 'पिथौरागढ़', pop: 483439, lit: 82.25, pci: 116000, tourists: 31, health: 154, schools: 1746, rain: 112, closed: 5, alerts: 3, mig: 79, ghosts: 68, net: 7.4, ind: 'Agriculture, border trade, magnesite' },
  { id: 'champawat', name: 'Champawat', hi: 'चंपावत', pop: 259648, lit: 79.83, pci: 111000, tourists: 22, health: 82, schools: 934, rain: 92, closed: 2, alerts: 1, mig: 64, ghosts: 26, net: 8.2, ind: 'Agriculture, tourism' },
  { id: 'nainital', name: 'Nainital', hi: 'नैनीताल', pop: 954605, lit: 83.88, pci: 186000, tourists: 69, health: 246, schools: 1968, rain: 87, closed: 1, alerts: 1, mig: 31, ghosts: 12, net: 21.4, ind: 'Tourism, horticulture, services' },
  { id: 'usnagar', name: 'Udham Singh Nagar', hi: 'ऊधम सिंह नगर', pop: 1648902, lit: 73.1, pci: 226000, tourists: 18, health: 298, schools: 2264, rain: 58, closed: 0, alerts: 1, mig: 7, ghosts: 1, net: 28.9, ind: 'Agro-processing, manufacturing, SIDCUL' },
]

export type ScreenId =
  | 'home'
  | 'district'
  | 'alerts'
  | 'compare'
  | 'migration'
  | 'tourism'
  | 'weather'
  | 'roads'
  | 'net'
  | 'offline'
  | 'intel'
  | 'gov'
  | 'account'

export const SCREENS: Record<ScreenId, [string, string]> = {
  home: ['Uttarakhand Home Dashboard', 'उत्तराखंड होम डैशबोर्ड'],
  district: ['District Dashboard', 'जिला डैशबोर्ड'],
  alerts: ['Live Alert System', 'लाइव अलर्ट प्रणाली'],
  compare: ['District Comparison', 'जिला तुलना'],
  migration: ['Palayan / Migration Tracker', 'पलायन ट्रैकर'],
  tourism: ['Live Tourism', 'लाइव पर्यटन'],
  weather: ['Weather & River Levels', 'मौसम एवं नदी जलस्तर'],
  roads: ['Roads, Traffic & Navigation', 'सड़क, यातायात एवं मार्ग'],
  net: ['Internet Speed & Connectivity', 'इंटरनेट गति एवं कनेक्टिविटी'],
  offline: ['Offline Mode', 'ऑफलाइन मोड'],
  intel: ['Sector Intelligence & Analytics', 'क्षेत्रीय आँकड़े एवं विश्लेषण'],
  gov: ['Governance Dashboard', 'शासन डैशबोर्ड'],
  account: ['Notification Alerts Account', 'सूचना अलर्ट खाता'],
}

export const NAV: { id: ScreenId; label: string; badge?: string }[] = [
  { id: 'home', label: 'Home dashboard' },
  { id: 'alerts', label: 'Live alerts', badge: '26' },
  { id: 'district', label: 'District dashboard' },
  { id: 'compare', label: 'Compare districts' },
  { id: 'roads', label: 'Traffic & roads', badge: '38' },
  { id: 'weather', label: 'Weather & rivers' },
  { id: 'tourism', label: 'Tourism live' },
  { id: 'migration', label: 'Migration tracker' },
  { id: 'net', label: 'Speed & connectivity' },
  { id: 'intel', label: 'Sector intelligence' },
  { id: 'gov', label: 'Governance dashboard' },
  { id: 'offline', label: 'Offline mode' },
]

export type MapLayer = 'alerts' | 'roads' | 'tourism' | 'weather' | 'migration' | 'population'

export const LAYER_LABELS: Record<MapLayer, string> = {
  alerts: 'Active alerts',
  roads: 'Closed roads',
  tourism: 'Tourist load',
  weather: 'Rainfall 24h',
  migration: 'Migration',
  population: 'Population',
}

export type AlertKind = 'weather' | 'road' | 'river' | 'disaster'

export type Alert = {
  kind: AlertKind
  title: string
  place: string
  status: string
  time: string
  source: string
  body: string
}

export const ALERTS: Alert[] = [
  { kind: 'weather', title: 'Heavy rainfall warning — Chamoli, Rudraprayag', place: 'Chamoli, Rudraprayag', status: 'Active', time: '12 min ago', source: 'IMD Dehradun', body: 'Very heavy rainfall likely in isolated places over the next 24 hours. Residents and travellers on the Badrinath and Kedarnath routes are advised to avoid night travel.' },
  { kind: 'road', title: 'NH-7 blocked at Sirobagad', place: 'Sirobagad, Rudraprayag', status: 'Blocked — clearance under way', time: '38 min ago', source: 'PWD / District Disaster Management', body: 'Debris slide has blocked both carriageways. Traffic is being diverted via the Rudraprayag–Tilwara link road. Estimated clearance six to eight hours.' },
  { kind: 'river', title: 'Alaknanda above warning level at Srinagar', place: 'Srinagar, Pauri Garhwal', status: 'Warning level', time: '1 hr ago', source: 'Central Water Commission', body: 'Level recorded at 535.6 m against a warning mark of 535.0 m and a danger mark of 536.0 m. Riverside settlements have been advised to move to higher ground.' },
  { kind: 'disaster', title: 'Landslide reported on Gangotri highway', place: 'Between Bhatwari and Gangnani, Uttarkashi', status: 'Under clearance', time: '2 hr ago', source: 'SDRF / SEOC Uttarakhand', body: 'A slope failure has narrowed the carriageway to single lane. Heavy vehicles are being held at Bhatwari until clearance is complete.' },
  { kind: 'road', title: 'Snow closure — Yamunotri approach road', place: 'Janki Chatti, Uttarkashi', status: 'Closed', time: '4 hr ago', source: 'District Administration Uttarkashi', body: 'The approach beyond Janki Chatti is closed to vehicular traffic. Pilgrims already at the base are being accommodated locally.' },
  { kind: 'weather', title: 'Thunderstorm with lightning — Kumaon belt', place: 'Nainital, Almora, Champawat', status: 'Active', time: '5 hr ago', source: 'IMD Dehradun', body: 'Thunderstorm accompanied by lightning and gusty winds reaching 40–50 kmph is likely at isolated places through the evening.' },
  { kind: 'disaster', title: 'Flash-flood risk in Kali river catchment', place: 'Dharchula, Pithoragarh', status: 'Monitoring', time: '7 hr ago', source: 'SEOC Uttarakhand', body: 'Sustained upstream rainfall has raised flash-flood risk in the catchment. Local administration is monitoring and has restricted riverbed activity.' },
]

export const ALERT_KIND: Record<AlertKind, { color: string; bg: string }> = {
  weather: { color: '#4F4C8F', bg: 'rgba(79,76,143,.12)' },
  road: { color: '#8A1C1C', bg: 'rgba(138,28,28,.1)' },
  river: { color: '#1D6A8A', bg: 'rgba(29,106,138,.12)' },
  disaster: { color: '#C2410C', bg: 'rgba(194,65,12,.12)' },
}

export const fmt = (n: number) => n.toLocaleString('en-IN')
export const money = (v: number) => '₹' + (v / 1000).toFixed(0) + 'k'
export const districtById = (id: string) => DISTRICTS.find((d) => d.id === id) || DISTRICTS[0]

export type Pill = { bg: string; fg: string; border: string; weight: number }
export const pill = (on: boolean, c: string): Pill =>
  on
    ? { bg: c, fg: '#FAF8F4', border: c, weight: 600 }
    : { bg: 'rgba(255,255,255,.7)', fg: 'rgba(20,32,28,.7)', border: 'rgba(20,32,28,.16)', weight: 500 }
