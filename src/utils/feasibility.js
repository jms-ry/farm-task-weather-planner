// ─── HEAT INDEX ───────────────────────────────────────────────────────────────
function calculateHeatIndex(tempC, humidity) {
  const T = tempC * 9/5 + 32
  const RH = humidity

  if (T < 80) return tempC

  const HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * RH -
    0.22475541 * T * RH -
    0.00683783 * T * T -
    0.05481717 * RH * RH +
    0.00122874 * T * T * RH +
    0.00085282 * T * RH * RH -
    0.00000199 * T * T * RH * RH

  return Math.round((HI - 32) * 5/9)
}

function getHIVerdict(hi) {
  if (hi > 41) return 'bad'
  if (hi > 32) return 'caution'
  return 'good'
}

// ─── TIME OF DAY ──────────────────────────────────────────────────────────────
const OPTIMAL_HOURS = {
  'pesticide-spraying':  [[5, 8], [16, 18]],
  'fertilizer-applying': [[5, 9], [16, 18]],
  'transplanting':       [[5, 8], [16, 18]],
  'fruit-picking':       [[5, 10]],
  'rice-harvesting':     [[5, 11]],
  'irrigation':          [[5, 8], [17, 18]],
  'sun-drying':          [[8, 16]],
}

function isOptimalTime(taskId, hour) {
  const ranges = OPTIMAL_HOURS[taskId]
  if (!ranges) return true
  return ranges.some(([start, end]) => hour >= start && hour < end)
}

// ─── ACTIVITY PROFILES ────────────────────────────────────────────────────────
const ACTIVITY_PROFILES = {
  'transplanting': {
    name: 'Transplanting',
    rain:     { risky: 40, bad: 70 },
    wind:     { risky: 25, bad: 40 },
    humidity: { risky: 85, bad: 95 },
    hi:       { caution: 33, bad: 42 },
    tips: {
      base: [
        { icon: '🌱', text: 'Transplant during early morning or late afternoon to reduce heat stress on seedlings.' },
        { icon: '💧', text: 'Water the seedlings immediately after transplanting to help roots establish.' },
        { icon: '🌿', text: 'Avoid transplanting under direct midday sun — seedlings are vulnerable to wilting.' },
      ],
      rain:     'Rain may displace seedlings and cause soil compaction — wait for it to clear.',
      wind:     'Strong wind can dry out and damage newly transplanted seedlings.',
      humidity: 'Very high humidity increases risk of fungal disease on young seedlings.',
      heat:     'High heat index causes transplant shock — work during cooler hours and shade seedlings.',
      time:     'Transplanting is best done in the early morning or late afternoon to avoid heat stress.',
    },
  },

  'seed-sowing': {
    name: 'Seed Sowing',
    rain:     { risky: 35, bad: 65 },
    wind:     { risky: 20, bad: 35 },
    humidity: { risky: 88, bad: 95 },
    hi:       { caution: 34, bad: 42 },
    tips: {
      base: [
        { icon: '🫘', text: 'Sow seeds in moist but not waterlogged soil for best germination rates.' },
        { icon: '☀️', text: 'Light cloud cover is ideal — too much direct sun can dry the topsoil quickly.' },
        { icon: '📏', text: 'Ensure proper seed depth to protect against surface rain splash.' },
      ],
      rain:     'Heavy rain can wash seeds away or cause waterlogging — delay sowing.',
      wind:     'Wind can scatter lightweight seeds and dry out the seedbed.',
      humidity: 'Excessive humidity after sowing may lead to seed rot before germination.',
      heat:     'High temperatures reduce germination rates — sow during cooler parts of the day.',
      time:     null,
    },
  },

  'pesticide-spraying': {
    name: 'Pesticide Spraying',
    rain:     { risky: 25, bad: 50 },
    wind:     { risky: 15, bad: 25 },
    humidity: { risky: 85, bad: 92 },
    hi:       { caution: 33, bad: 41 },
    tips: {
      base: [
        { icon: '🧴', text: 'Spray during early morning (5–8 AM) when wind is calmest and temperatures are cool.' },
        { icon: '😷', text: 'Always wear protective gear — gloves, mask, and goggles when handling pesticides.' },
        { icon: '⏱', text: 'Ensure at least 4–6 hours of dry weather after spraying for the pesticide to absorb.' },
      ],
      rain:     'Rain will wash off pesticide before it absorbs — spraying now wastes product and pollutes waterways.',
      wind:     'Wind causes pesticide drift away from target crops and onto neighboring fields or water sources.',
      humidity: 'Very high humidity slows pesticide absorption and increases the risk of fungal issues.',
      heat:     'High heat index causes pesticide to evaporate quickly, reducing effectiveness and increasing exposure risk.',
      time:     'Pesticide spraying is safest in the early morning (5–8 AM) or late afternoon (4–6 PM) when wind is calmest.',
    },
  },

  'fertilizer-applying': {
    name: 'Fertilizer Applying',
    rain:     { risky: 30, bad: 55 },
    wind:     { risky: 25, bad: 40 },
    humidity: { risky: 90, bad: 97 },
    hi:       { caution: 34, bad: 42 },
    tips: {
      base: [
        { icon: '🌿', text: 'Apply fertilizer when soil is moist but not saturated for best nutrient uptake.' },
        { icon: '🌅', text: 'Early morning application reduces nutrient loss from evaporation.' },
        { icon: '💧', text: 'Light irrigation after application helps nutrients reach the root zone.' },
      ],
      rain:     'Heavy rain leaches fertilizer away from root zones, wasting product and polluting waterways.',
      wind:     'Wind scatters granular fertilizer unevenly and causes nutrient loss.',
      humidity: 'Very high humidity causes granular fertilizer to clump and apply unevenly.',
      heat:     'High heat increases nitrogen evaporation loss — apply during cooler hours.',
      time:     'Fertilizer is best applied in the early morning or late afternoon to minimize evaporation loss.',
    },
  },

  'irrigation': {
    name: 'Irrigation',
    rain:     { risky: 30, bad: 50 },
    wind:     { risky: 20, bad: 35 },
    humidity: { risky: 88, bad: 95 },
    hi:       { caution: 35, bad: 43 },
    tips: {
      base: [
        { icon: '💧', text: 'Irrigate during early morning or evening to minimize evaporation losses.' },
        { icon: '📊', text: 'Check soil moisture before irrigating — overwatering reduces root oxygen and causes disease.' },
        { icon: '🌾', text: 'Adjust irrigation schedule based on crop growth stage and current weather.' },
      ],
      rain:     'Rain is expected — irrigation may not be necessary and could lead to waterlogging.',
      wind:     'High wind reduces sprinkler irrigation efficiency through evaporation and uneven distribution.',
      humidity: 'Very high humidity combined with irrigation increases fungal disease risk.',
      heat:     'Irrigate more frequently during high heat but avoid midday when evaporation losses are highest.',
      time:     'Irrigation is most efficient in the early morning (5–8 AM) or early evening (5–6 PM) to minimize evaporation.',
    },
  },

  'rice-harvesting': {
    name: 'Rice Harvesting',
    rain:     { risky: 20, bad: 40 },
    wind:     { risky: 30, bad: 50 },
    humidity: { risky: 80, bad: 90 },
    hi:       { caution: 34, bad: 42 },
    tips: {
      base: [
        { icon: '🌾', text: 'Harvest when grain moisture is at 20–25% for best milling quality.' },
        { icon: '☀️', text: 'Choose a dry, sunny window of at least 2–3 consecutive dry hours for harvesting.' },
        { icon: '🚜', text: 'Avoid harvesting in wet fields — machinery gets stuck and grain quality drops.' },
      ],
      rain:     'Wet grain during harvest leads to mold, discoloration, and poor milling recovery.',
      wind:     'Strong wind causes grain shattering and loss before and during harvest.',
      humidity: 'High humidity slows field drying and increases post-harvest grain spoilage risk.',
      heat:     'Work during early morning hours to avoid peak heat — heat accelerates grain quality deterioration.',
      time:     'Rice harvesting is best done in the early morning (5–11 AM) before peak heat and afternoon humidity builds.',
    },
  },

  'fruit-picking': {
    name: 'Fruit Picking',
    rain:     { risky: 30, bad: 60 },
    wind:     { risky: 25, bad: 45 },
    humidity: { risky: 85, bad: 93 },
    hi:       { caution: 33, bad: 41 },
    tips: {
      base: [
        { icon: '🍅', text: 'Pick fruits in the early morning when temperatures are cooler for longer shelf life.' },
        { icon: '🧺', text: 'Handle fruits gently — bruising accelerates spoilage especially in humid conditions.' },
        { icon: '☀️', text: 'Avoid picking immediately after rain — wet fruit surfaces promote mold growth.' },
      ],
      rain:     'Picking wet fruits accelerates mold and reduces post-harvest shelf life.',
      wind:     'Strong wind causes fruit drop and physical damage to branches.',
      humidity: 'Very high humidity promotes fungal growth on freshly picked fruits.',
      heat:     'High heat rapidly deteriorates picked fruits — harvest early and store in shade immediately.',
      time:     'Fruit picking is best done in the early morning (5–10 AM) when fruits are cool and firm.',
    },
  },

  'plowing': {
    name: 'Plowing',
    rain:     { risky: 40, bad: 70 },
    wind:     { risky: 40, bad: 65 },
    humidity: { risky: 92, bad: 98 },
    hi:       { caution: 35, bad: 43 },
    tips: {
      base: [
        { icon: '🚜', text: 'Plow when soil moisture is at field capacity — not too wet, not too dry.' },
        { icon: '🌅', text: 'Early morning plowing avoids peak heat and allows soil to settle by evening.' },
        { icon: '🌱', text: 'Incorporate crop residue during plowing to improve organic matter content.' },
      ],
      rain:     'Wet soil compacts under machinery weight, damaging soil structure and root development.',
      wind:     'High wind causes significant topsoil erosion during and after plowing.',
      humidity: 'Extremely humid conditions make heavy clay soils too sticky for effective plowing.',
      heat:     'High heat index during plowing increases operator heat exhaustion risk — take frequent breaks.',
      time:     null,
    },
  },

  'composting': {
    name: 'Composting',
    rain:     { risky: 70, bad: 90 },
    wind:     { risky: 50, bad: 70 },
    humidity: { risky: 93, bad: 98 },
    hi:       { caution: 36, bad: 44 },
    tips: {
      base: [
        { icon: '♻️', text: 'Turn compost pile regularly to maintain aeration and speed up decomposition.' },
        { icon: '💧', text: 'Keep compost moist but not waterlogged — like a wrung-out sponge.' },
        { icon: '🌿', text: 'Balance green (nitrogen-rich) and brown (carbon-rich) materials for best results.' },
      ],
      rain:     'Heavy rain can waterlog the compost pile, slowing decomposition and causing odor.',
      wind:     'Strong wind dries out the compost pile and scatters lightweight materials.',
      humidity: 'Extremely high humidity combined with rain increases leachate runoff from piles.',
      heat:     'High heat accelerates decomposition but increases evaporation — monitor pile moisture closely.',
      time:     null,
    },
  },

  'sun-drying': {
    name: 'Sun Drying Grains',
    rain:     { risky: 15, bad: 30 },
    wind:     { risky: 35, bad: 55 },
    humidity: { risky: 70, bad: 82 },
    hi:       { caution: 38, bad: 52 },
    requiresSun: true,
    tips: {
      base: [
        { icon: '☀️', text: 'Spread grains thinly (2–3 cm) on a clean tarp for faster and even drying.' },
        { icon: '🔄', text: 'Turn grains every 1–2 hours to ensure uniform moisture reduction.' },
        { icon: '🌙', text: 'Collect grains before sunset to prevent moisture reabsorption overnight.' },
      ],
      rain:     'Any rain will re-wet the grains and may cause mold — bring them in immediately.',
      wind:     'Strong wind scatters lightweight grains and contaminates them with dust and debris.',
      humidity: 'High humidity slows drying significantly — grains may not reach safe moisture levels.',
      heat:     'Very high heat index is ideal for drying — work in shade nearby and hydrate frequently.',
      cloud:    'Overcast skies significantly slow grain drying — consider delaying or using a mechanical dryer.',
      time:     'Sun drying requires active sunlight — only effective between 8 AM and 4 PM.',
    },
  },

  'threshing': {
    name: 'Threshing',
    rain:     { risky: 25, bad: 50 },
    wind:     { risky: 20, bad: 35 },
    humidity: { risky: 82, bad: 90 },
    hi:       { caution: 35, bad: 43 },
    tips: {
      base: [
        { icon: '🌀', text: 'Thresh when grain moisture is below 25% for best separation efficiency.' },
        { icon: '🏚', text: 'Do threshing under a covered area if possible to protect from sudden rain.' },
        { icon: '🌾', text: 'Clean and dry the threshing area beforehand to prevent grain contamination.' },
      ],
      rain:     'Rain wets the grain during threshing, increasing moisture content and spoilage risk.',
      wind:     'Wind scatters grain during threshing and reduces recovery efficiency.',
      humidity: 'High humidity during threshing causes grain to absorb moisture, reducing quality.',
      heat:     'Work in shaded or ventilated areas during high heat — take breaks and hydrate.',
      time:     null,
    },
  },

  'grazing': {
    name: 'Livestock Grazing',
    rain:     { risky: 55, bad: 80 },
    wind:     { risky: 35, bad: 55 },
    humidity: { risky: 88, bad: 95 },
    hi:       { caution: 34, bad: 42 },
    tips: {
      base: [
        { icon: '🐄', text: 'Rotate grazing areas to prevent overgrazing and allow pasture recovery.' },
        { icon: '💧', text: 'Ensure livestock have access to clean water especially during warm weather.' },
        { icon: '🌿', text: 'Avoid grazing wet pastures — hooves churn up and damage waterlogged soil.' },
      ],
      rain:     'Heavy rain and waterlogged pastures damage soil structure and expose livestock to mud fever.',
      wind:     'Strong wind causes stress in livestock, especially young animals.',
      humidity: 'Very high humidity combined with heat causes heat stress in cattle and other livestock.',
      heat:     'High heat index stresses livestock — ensure shade access and limit grazing to early morning and evening.',
      time:     null,
    },
  },
}

const GENERIC_OUTDOOR_PROFILE = {
  name: 'Outdoor Farm Task',
  rain:     { risky: 40, bad: 70 },
  wind:     { risky: 30, bad: 50 },
  humidity: { risky: 88, bad: 95 },
  hi:       { caution: 33, bad: 42 },
  tips: {
    base: [
      { icon: '🌤', text: 'Monitor weather conditions closely during your task and be ready to stop if conditions worsen.' },
      { icon: '💧', text: 'Stay hydrated and take breaks during warm or humid conditions.' },
      { icon: '🌾', text: 'Have a contingency plan ready in case weather deteriorates unexpectedly.' },
    ],
    rain:     'Rain may disrupt your outdoor farm task — consider rescheduling or preparing cover.',
    wind:     'Strong wind can interfere with many outdoor farm activities.',
    humidity: 'Very high humidity makes physical farm work uncomfortable and increases health risks.',
    heat:     'High heat index increases heat exhaustion risk — work during cooler hours.',
    time:     null,
  },
}

const KEYWORD_MAP = {
  'transplanting':        ['transplant', 'seedling', 'pindot', 'tanim'],
  'seed-sowing':          ['seed', 'sow', 'sowing', 'hasik', 'binhi'],
  'pesticide-spraying':   ['pesticide', 'spray', 'insecticide', 'herbicide', 'fungicide', 'chemical', 'bugsok'],
  'fertilizer-applying':  ['fertilizer', 'fertilize', 'abono', 'compost apply', 'nutrient'],
  'irrigation':           ['irrigat', 'water', 'tubig', 'flood', 'dilig'],
  'rice-harvesting':      ['harvest', 'rice', 'palay', 'ani', 'reap'],
  'fruit-picking':        ['fruit', 'pick', 'prutas', 'vegetable', 'gulay', 'pitas'],
  'plowing':              ['plow', 'till', 'araro', 'cultivat', 'harrow'],
  'composting':           ['compost', 'organic', 'waste', 'decompos'],
  'sun-drying':           ['dry', 'sun', 'drying', 'palay dry', 'grain dry', 'bilad'],
  'threshing':            ['thresh', 'giik', 'separate', 'grain separ'],
  'grazing':              ['graz', 'livestock', 'cattle', 'animal', 'baka', 'hayop', 'pasture'],
}

export function getActivityProfile(taskName) {
  const lower = taskName.toLowerCase()
  const stemmed = lower.replace(/ing|ed|s\b/g, '').trim()

  for (const [id, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some(k => lower.includes(k) || stemmed.includes(k))) {
      return { id, ...ACTIVITY_PROFILES[id] }
    }
  }

  return { id: 'generic', ...GENERIC_OUTDOOR_PROFILE }
}

// ─── NIGHT MODE CHECK ─────────────────────────────────────────────────────────
export function isNightTime(startTime, startMode) {
  const date = startMode === 'now' ? new Date() : (() => {
    const [h, m] = startTime.split(':').map(Number)
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d
  })()
  return date.getHours() >= 20
}

export function getNextOptimalTime(taskId) {
  const ranges = OPTIMAL_HOURS[taskId]
  if (!ranges) return '5:00 AM'
  const earliest = ranges[0][0]
  return `${earliest}:00 AM`
}

// ─── MAIN ANALYZER ────────────────────────────────────────────────────────────
export function analyzeFeasibility(taskName, startTime, startMode, durationValue, hourlyData) {
  const profile = getActivityProfile(taskName)
  const window = getWeatherWindow(startTime, durationValue, hourlyData, startMode)

  if (window.length === 0) {
    return {
      verdict: 'good',
      verdictLabel: 'Good to Go!',
      verdictSub: 'No weather data available for this window. Conditions assumed favorable.',
      hourly: [],
      factors: buildFactors([], profile),
      bestTime: null,
      tips: profile.tips.base,
      profile,
      nightMode: false,
    }
  }

  // Time of day check
  const startHour = new Date(window[0].time + ':00+08:00').getHours()
  const timeIsOptimal = isOptimalTime(profile.id, startHour)

  // Weather verdict
  const weatherVerdict = determineWeatherVerdict(window, profile)

  // Heat index verdict
  const maxHI = Math.max(...window.map(h => h.heatIndex ?? calculateHeatIndex(h.temp, h.humidity)))
  const hiVerdict = getHIVerdict(maxHI)

  // Sun/cloud check for drying tasks
  const cloudVerdict = profile.requiresSun ? determineSunVerdict(window) : 'good'

  // Combine all verdicts — worst wins
  const verdictOrder = ['good', 'caution', 'risky', 'bad']
  const finalVerdict = [weatherVerdict, hiVerdict, cloudVerdict,
    timeIsOptimal ? 'good' : 'caution']
    .reduce((worst, v) => verdictOrder.indexOf(v) > verdictOrder.indexOf(worst) ? v : worst, 'good')

  const bestWindow = findBestWindow(hourlyData, durationValue, profile, startTime, startMode)
  const showBestWindow = finalVerdict !== 'good' ? bestWindow : null
  const tips = buildTips(profile, window, maxHI, timeIsOptimal, cloudVerdict)

  return {
    verdict: finalVerdict,
    verdictLabel: getVerdictLabel(finalVerdict, timeIsOptimal, maxHI, cloudVerdict),
    verdictSub: getVerdictSub(finalVerdict, profile, window, maxHI, timeIsOptimal, cloudVerdict),
    hourly: window,
    factors: buildFactors(window, profile),
    bestTime: showBestWindow,
    tips,
    profile,
    nightMode: false,
  }
}

// ─── WEATHER VERDICT ──────────────────────────────────────────────────────────
function determineWeatherVerdict(window, profile) {
  for (const hour of window) {
    if (hour.rain >= profile.rain.bad || hour.wind >= profile.wind.bad || hour.humidity >= profile.humidity.bad)
      return 'bad'
  }
  for (const hour of window) {
    if (hour.rain >= profile.rain.risky || hour.wind >= profile.wind.risky || hour.humidity >= profile.humidity.risky)
      return 'risky'
  }
  return 'good'
}

// ─── SUN/CLOUD VERDICT ────────────────────────────────────────────────────────
function determineSunVerdict(window) {
  for (const hour of window) {
    if (hour.weatherCode >= 3) return 'bad'
  }
  for (const hour of window) {
    if (hour.weatherCode === 2) return 'risky'
  }
  return 'good'
}

// ─── VERDICT LABELS ───────────────────────────────────────────────────────────
function getVerdictLabel(verdict, timeIsOptimal, maxHI, cloudVerdict) {
  if (verdict === 'bad')     return 'Not Recommended — Consider Rescheduling'
  if (verdict === 'risky')   return 'Risky — Proceed with Caution'
  if (verdict === 'caution') {
    if (maxHI > 32 && maxHI <= 41) return 'Proceed with Caution — High Heat Index'
    if (!timeIsOptimal)             return 'Proceed with Caution — Not Optimal Time'
    if (cloudVerdict === 'risky')   return 'Proceed with Caution — Limited Sunlight'
    return 'Proceed with Caution'
  }
  return 'Good to Go!'
}

function getVerdictSub(verdict, profile, window, maxHI, timeIsOptimal, cloudVerdict) {
  if (verdict === 'good') return `Conditions look favorable for ${profile.name}.`

  const issues = []
  const maxRain     = Math.max(...window.map(h => h.rain))
  const maxWind     = Math.max(...window.map(h => h.wind))
  const maxHumidity = Math.max(...window.map(h => h.humidity))

  if (maxRain >= profile.rain.bad)           issues.push(`high rain chance (${maxRain}%)`)
  else if (maxRain >= profile.rain.risky)    issues.push(`moderate rain chance (${maxRain}%)`)

  if (maxWind >= profile.wind.bad)           issues.push(`strong wind (${maxWind} km/h)`)
  else if (maxWind >= profile.wind.risky)    issues.push(`moderate wind (${maxWind} km/h)`)

  if (maxHumidity >= profile.humidity.bad)   issues.push(`high humidity (${maxHumidity}%)`)
  else if (maxHumidity >= profile.humidity.risky) issues.push(`moderate humidity (${maxHumidity}%)`)

  if (maxHI > 41)       issues.push(`dangerous heat index (${maxHI}°C)`)
  else if (maxHI > 32)  issues.push(`elevated heat index (${maxHI}°C)`)

  if (!timeIsOptimal && profile.tips.time) issues.push('non-optimal time of day')
  if (cloudVerdict !== 'good')             issues.push('insufficient sunlight for drying')

  return issues.length > 0 ? `Due to ${formatIssues(issues)} in your window.` : `Conditions are borderline for ${profile.name}.`
}

// ─── FACTORS ─────────────────────────────────────────────────────────────────
export function buildFactors(window, profile) {
  if (!window || window.length === 0) return [
    { icon: '🌧', label: 'Rain',       value: 'N/A', level: 'ok' },
    { icon: '💨', label: 'Wind',       value: 'N/A', level: 'ok' },
    { icon: '💧', label: 'Humidity',   value: 'N/A', level: 'ok' },
    { icon: '🌡', label: 'Heat Index', value: 'N/A', level: 'ok' },
  ]

  const maxRain     = Math.max(...window.map(h => h.rain))
  const maxWind     = Math.max(...window.map(h => h.wind))
  const maxHumidity = Math.max(...window.map(h => h.humidity))
  const maxHI       = Math.max(...window.map(h => h.heatIndex ?? calculateHeatIndex(h.temp, h.humidity)))

  const rainLevel = maxRain >= (profile?.rain?.bad ?? 60)   ? 'bad': maxRain >= (profile?.rain?.risky ?? 35)  ? 'warn' : 'ok'

  const windLevel = maxWind >= (profile?.wind?.bad ?? 40)   ? 'bad': maxWind >= (profile?.wind?.risky ?? 25)  ? 'warn' : 'ok'

  const humidityLevel = maxHumidity >= (profile?.humidity?.bad ?? 90)   ? 'bad': maxHumidity >= (profile?.humidity?.risky ?? 80)  ? 'warn' : 'ok'

  return [
    { icon: '🌧', label: 'Rain',       value: `${maxRain}%`,    level: rainLevel     },
    { icon: '💨', label: 'Wind',       value: `${maxWind}km/h`, level: windLevel     },
    { icon: '💧', label: 'Humidity',   value: `${maxHumidity}%`,level: humidityLevel },
    { icon: '🌡', label: 'Heat Index', value: `${maxHI}°C`,     level: getHILevel(maxHI) },
  ]
}

function getHILevel(v)       { return v > 41  ? 'bad' : v > 32  ? 'warn' : 'ok' }

// ─── TIPS ─────────────────────────────────────────────────────────────────────
function buildTips(profile, window, maxHI, timeIsOptimal, cloudVerdict) {
  const tips = [...profile.tips.base]
  const maxRain     = Math.max(...window.map(h => h.rain))
  const maxWind     = Math.max(...window.map(h => h.wind))
  const maxHumidity = Math.max(...window.map(h => h.humidity))

  if (maxRain     >= profile.rain.risky)     tips.push({ icon: '🌧', text: `${profile.tips.rain} (Peak: ${maxRain}%)` })
  if (maxWind     >= profile.wind.risky)     tips.push({ icon: '💨', text: `${profile.tips.wind} (Peak: ${maxWind} km/h)` })
  if (maxHumidity >= profile.humidity.risky) tips.push({ icon: '💧', text: `${profile.tips.humidity} (Peak: ${maxHumidity}%)` })
  if (maxHI > 32)                            tips.push({ icon: '🌡', text: `${profile.tips.heat} (Heat index: ${maxHI}°C)` })
  if (!timeIsOptimal && profile.tips.time)   tips.push({ icon: '🕐', text: profile.tips.time })
  if (cloudVerdict !== 'good' && profile.tips.cloud) tips.push({ icon: '☁️', text: profile.tips.cloud })

  return tips
}

// ─── WINDOW HELPERS ───────────────────────────────────────────────────────────
function getWeatherWindow(startTime, durationValue, hourlyData, startMode) {
  const durationHours = parseDurationMax(durationValue)
  const startDate = getStartDate(startTime, startMode)
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000)

  return hourlyData
    .filter(h => {
      const hTime = new Date(h.time + ':00+08:00')
      return hTime >= startDate && hTime < endDate
    })
    .slice(0, durationHours)
}

function getStartDate(startTime, startMode) {
  if (startMode === 'now') return new Date()
  const now = new Date()
  const [hours, minutes] = startTime.split(':').map(Number)
  const start = new Date(now)
  start.setHours(hours, minutes, 0, 0)
  return start
}

function parseDurationMax(value) {
  if (value === '1-2') return 2
  if (value === '3-5') return 5
  return 8
}

function findBestWindow(hourlyData, durationValue, profile, startTime, startMode) {
  const duration = parseDurationMax(durationValue)
  const now = getStartDate(startTime, startMode)

  const futureHours = hourlyData.filter(h => {
    const hTime = new Date(h.time + ':00+08:00')
    const hour = hTime.getHours()
    return hTime >= now && hour >= 5 && hour < 18
  })

  let bestStart = null
  let bestScore = Infinity

  for (let i = 0; i <= futureHours.length - duration; i++) {
    const window = futureHours.slice(i, i + duration)
    const windowEnd = new Date(new Date(window[0].time + ':00+08:00').getTime() + duration * 60 * 60 * 1000)
    if (windowEnd.getHours() > 18) continue

    // Prefer optimal hours for this task
    const startHour = new Date(window[0].time + ':00+08:00').getHours()
    const timeBonus = isOptimalTime(profile.id, startHour) ? 0 : 0.5

    const hi = Math.max(...window.map(h => h.heatIndex ?? calculateHeatIndex(h.temp, h.humidity)))
    const hiPenalty = hi > 41 ? 2 : hi > 32 ? 0.5 : 0

    const score = timeBonus + hiPenalty + window.reduce((sum, h) => (
      sum +
      (h.rain / profile.rain.bad) +
      (h.wind / profile.wind.bad) +
      (h.humidity / profile.humidity.bad)
    ), 0)

    if (score < bestScore) {
      bestScore = score
      bestStart = window[0]
    }
  }

  if (!bestStart) return null

  const startDate = new Date(bestStart.time + ':00+08:00')
  const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const isToday    = startDate.toDateString() === today.toDateString()
  const isTomorrow = startDate.toDateString() === tomorrow.toDateString()

  let dayLabel
  if (isToday)         dayLabel = 'Today'
  else if (isTomorrow) dayLabel = 'Tomorrow'
  else                 dayLabel = startDate.toLocaleDateString('en-PH', { weekday: 'long', month: 'short', day: 'numeric' })

  return {
    label: `${dayLabel}, ${formatTime(startDate)} – ${formatTime(endDate)}`,
    rain: Math.round(bestStart.rain),
    wind: Math.round(bestStart.wind),
    humidity: Math.round(bestStart.humidity),
    hi: bestStart.heatIndex ?? calculateHeatIndex(bestStart.temp, bestStart.humidity),
  }
}

function formatTime(date) {
  return date.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true })
}

// Issues Helper

function formatIssues(issues) {
  if (issues.length === 1) return issues[0]
  if (issues.length === 2) return issues.join(' and ')
  
  return `${issues.slice(0, -1).join(', ')}, and ${issues[issues.length - 1]}`
}