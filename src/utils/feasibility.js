const ACTIVITY_PROFILES = {
  'transplanting': {
    name: 'Transplanting',
    rain:     { risky: 40, bad: 70 },
    wind:     { risky: 25, bad: 40 },
    humidity: { risky: 85, bad: 95 },
    temp:     { riskyHigh: 36, badHigh: 40, riskyLow: 15, badLow: 10 },
    tips: {
      base: [
        { icon: '🌱', text: 'Transplant during early morning or late afternoon to reduce heat stress on seedlings.' },
        { icon: '💧', text: 'Water the seedlings immediately after transplanting to help roots establish.' },
        { icon: '🌿', text: 'Avoid transplanting under direct midday sun — seedlings are vulnerable to wilting.' },
      ],
      rain:     'Rain may displace seedlings and cause soil compaction — wait for it to clear.',
      wind:     'Strong wind can dry out and damage newly transplanted seedlings.',
      humidity: 'Very high humidity increases risk of fungal disease on young seedlings.',
      heat:     'Extreme heat causes transplant shock — consider shading or waiting for cooler hours.',
    },
  },

  'seed-sowing': {
    name: 'Seed Sowing',
    rain:     { risky: 35, bad: 65 },
    wind:     { risky: 20, bad: 35 },
    humidity: { risky: 88, bad: 95 },
    temp:     { riskyHigh: 38, badHigh: 42, riskyLow: 15, badLow: 10 },
    tips: {
      base: [
        { icon: '🫘', text: 'Sow seeds in moist but not waterlogged soil for best germination rates.' },
        { icon: '☀️', text: 'Light cloud cover is ideal — too much direct sun can dry the topsoil quickly.' },
        { icon: '📏', text: 'Ensure proper seed depth to protect against surface rain splash.' },
      ],
      rain:     'Heavy rain can wash seeds away or cause waterlogging — delay sowing.',
      wind:     'Wind can scatter lightweight seeds and dry out the seedbed.',
      humidity: 'Excessive humidity after sowing may lead to seed rot before germination.',
      heat:     'High temperatures reduce germination rates for most rice and vegetable varieties.',
    },
  },

  'pesticide-spraying': {
    name: 'Pesticide Spraying',
    rain:     { risky: 25, bad: 50 },
    wind:     { risky: 15, bad: 25 },
    humidity: { risky: 85, bad: 92 },
    temp:     { riskyHigh: 35, badHigh: 40, riskyLow: 10, badLow: 5 },
    tips: {
      base: [
        { icon: '🧴', text: 'Spray during early morning (6–8 AM) when wind is calmest and temperatures are cool.' },
        { icon: '😷', text: 'Always wear protective gear — gloves, mask, and goggles when handling pesticides.' },
        { icon: '⏱', text: 'Ensure at least 4–6 hours of dry weather after spraying for the pesticide to absorb.' },
      ],
      rain:     'Rain will wash off pesticide before it absorbs — spraying now wastes product and pollutes waterways.',
      wind:     'Wind causes pesticide drift away from target crops and onto neighboring fields or water sources.',
      humidity: 'Very high humidity slows pesticide absorption and increases the risk of fungal issues.',
      heat:     'Extreme heat causes pesticide to evaporate quickly, reducing effectiveness.',
    },
  },

  'fertilizer-applying': {
    name: 'Fertilizer Applying',
    rain:     { risky: 50, bad: 75 },
    wind:     { risky: 25, bad: 40 },
    humidity: { risky: 90, bad: 97 },
    temp:     { riskyHigh: 38, badHigh: 42, riskyLow: 10, badLow: 5 },
    tips: {
      base: [
        { icon: '🌿', text: 'Apply fertilizer when soil is moist but not saturated for best nutrient uptake.' },
        { icon: '🌅', text: 'Early morning application reduces nutrient loss from evaporation.' },
        { icon: '💧', text: 'Light irrigation after application helps nutrients reach the root zone.' },
      ],
      rain:     'Heavy rain leaches fertilizer away from root zones, wasting product and polluting waterways.',
      wind:     'Wind scatters granular fertilizer unevenly and causes nutrient loss.',
      humidity: 'Very high humidity causes granular fertilizer to clump and apply unevenly.',
      heat:     'Extreme heat increases nitrogen evaporation loss, especially from urea-based fertilizers.',
    },
  },

  'irrigation': {
    name: 'Irrigation',
    rain:     { risky: 50, bad: 80 },
    wind:     { risky: 30, bad: 50 },
    humidity: { risky: 92, bad: 98 },
    temp:     { riskyHigh: 42, badHigh: 48, riskyLow: 5, badLow: 0 },
    tips: {
      base: [
        { icon: '💧', text: 'Irrigate during early morning or evening to minimize evaporation losses.' },
        { icon: '📊', text: 'Check soil moisture before irrigating — overwatering reduces root oxygen and causes disease.' },
        { icon: '🌾', text: 'Adjust irrigation schedule based on crop growth stage and current weather.' },
      ],
      rain:     'Rain is expected — irrigation may not be necessary and could lead to waterlogging.',
      wind:     'High wind reduces sprinkler irrigation efficiency through evaporation and uneven distribution.',
      humidity: 'Very high humidity combined with irrigation increases fungal disease risk.',
      heat:     'Irrigate more frequently during extreme heat to prevent crop water stress.',
    },
  },

  'rice-harvesting': {
    name: 'Rice Harvesting',
    rain:     { risky: 20, bad: 40 },
    wind:     { risky: 30, bad: 50 },
    humidity: { risky: 80, bad: 90 },
    temp:     { riskyHigh: 38, badHigh: 42, riskyLow: 10, badLow: 5 },
    tips: {
      base: [
        { icon: '🌾', text: 'Harvest when grain moisture is at 20–25% for best milling quality.' },
        { icon: '☀️', text: 'Choose a dry, sunny window of at least 2–3 consecutive days for harvesting and drying.' },
        { icon: '🚜', text: 'Avoid harvesting in wet fields — machinery gets stuck and grain quality drops.' },
      ],
      rain:     'Wet grain during harvest leads to mold, discoloration, and poor milling recovery.',
      wind:     'Strong wind causes grain shattering and loss before and during harvest.',
      humidity: 'High humidity slows field drying and increases post-harvest grain spoilage risk.',
      heat:     'Harvest early in the day to avoid peak heat which accelerates grain quality deterioration.',
    },
  },

  'fruit-picking': {
    name: 'Fruit Picking',
    rain:     { risky: 30, bad: 60 },
    wind:     { risky: 25, bad: 45 },
    humidity: { risky: 85, bad: 93 },
    temp:     { riskyHigh: 37, badHigh: 41, riskyLow: 10, badLow: 5 },
    tips: {
      base: [
        { icon: '🍅', text: 'Pick fruits in the early morning when temperatures are cooler for longer shelf life.' },
        { icon: '🧺', text: 'Handle fruits gently — bruising accelerates spoilage especially in humid conditions.' },
        { icon: '☀️', text: 'Avoid picking immediately after rain — wet fruit surfaces promote mold growth.' },
      ],
      rain:     'Picking wet fruits accelerates mold and reduces post-harvest shelf life.',
      wind:     'Strong wind causes fruit drop and physical damage to branches.',
      humidity: 'Very high humidity promotes fungal growth on freshly picked fruits.',
      heat:     'Extreme heat rapidly deteriorates picked fruits — harvest early and store in shade.',
    },
  },

  'plowing': {
    name: 'Plowing',
    rain:     { risky: 40, bad: 70 },
    wind:     { risky: 40, bad: 65 },
    humidity: { risky: 92, bad: 98 },
    temp:     { riskyHigh: 40, badHigh: 45, riskyLow: 5, badLow: 0 },
    tips: {
      base: [
        { icon: '🚜', text: 'Plow when soil moisture is at field capacity — not too wet, not too dry.' },
        { icon: '🌅', text: 'Early morning plowing avoids peak heat and allows soil to settle by evening.' },
        { icon: '🌱', text: 'Incorporate crop residue during plowing to improve organic matter content.' },
      ],
      rain:     'Wet soil compacts under machinery weight, damaging soil structure and root development.',
      wind:     'High wind causes significant topsoil erosion during and after plowing.',
      humidity: 'Extremely humid conditions make heavy clay soils too sticky for effective plowing.',
      heat:     'Extreme heat causes rapid soil moisture loss after plowing — incorporate residue quickly.',
    },
  },

  'composting': {
    name: 'Composting',
    rain:     { risky: 70, bad: 90 },
    wind:     { risky: 50, bad: 70 },
    humidity: { risky: 93, bad: 98 },
    temp:     { riskyHigh: 42, badHigh: 48, riskyLow: 5, badLow: 0 },
    tips: {
      base: [
        { icon: '♻️', text: 'Turn compost pile regularly to maintain aeration and speed up decomposition.' },
        { icon: '💧', text: 'Keep compost moist but not waterlogged — like a wrung-out sponge.' },
        { icon: '🌿', text: 'Balance green (nitrogen-rich) and brown (carbon-rich) materials for best results.' },
      ],
      rain:     'Heavy rain can waterlog the compost pile, slowing decomposition and causing odor.',
      wind:     'Strong wind dries out the compost pile and scatters lightweight materials.',
      humidity: 'Extremely high humidity combined with rain increases leachate runoff from piles.',
      heat:     'Extreme heat can dry out the compost pile — monitor moisture levels closely.',
    },
  },

  'sun-drying': {
    name: 'Sun Drying Grains',
    rain:     { risky: 15, bad: 30 },
    wind:     { risky: 35, bad: 55 },
    humidity: { risky: 70, bad: 82 },
    temp:     { riskyHigh: 45, badHigh: 50, riskyLow: 22, badLow: 18 },
    tips: {
      base: [
        { icon: '☀️', text: 'Spread grains thinly (2–3 cm) on a clean tarp for faster and even drying.' },
        { icon: '🔄', text: 'Turn grains every 1–2 hours to ensure uniform moisture reduction.' },
        { icon: '🌙', text: 'Collect grains before sunset to prevent moisture reabsorption overnight.' },
      ],
      rain:     'Any rain will re-wet the grains and may cause mold — bring them in immediately.',
      wind:     'Strong wind scatters lightweight grains and contaminates them with dust and debris.',
      humidity: 'High humidity slows drying significantly — grains may not reach safe moisture levels.',
      heat:     'Very high temperatures can cause grain cracking — provide partial shade if needed.',
    },
  },

  'threshing': {
    name: 'Threshing',
    rain:     { risky: 25, bad: 50 },
    wind:     { risky: 20, bad: 35 },
    humidity: { risky: 82, bad: 90 },
    temp:     { riskyHigh: 40, badHigh: 45, riskyLow: 10, badLow: 5 },
    tips: {
      base: [
        { icon: '🌀', text: 'Thresh when grain moisture is below 25% for best separation efficiency.' },
        { icon: '🏚', text: 'Do threshing under a covered area if possible to protect from sudden rain.' },
        { icon: '🌾', text: 'Clean and dry the threshing area beforehand to prevent grain contamination.' },
      ],
      rain:     'Rain wets the grain during threshing, increasing moisture content and spoilage risk.',
      wind:     'Wind scatters grain during threshing and reduces recovery efficiency.',
      humidity: 'High humidity during threshing causes grain to absorb moisture, reducing quality.',
      heat:     'Work in shaded or ventilated areas during extreme heat to avoid heat exhaustion.',
    },
  },

  'grazing': {
    name: 'Livestock Grazing',
    rain:     { risky: 55, bad: 80 },
    wind:     { risky: 35, bad: 55 },
    humidity: { risky: 88, bad: 95 },
    temp:     { riskyHigh: 38, badHigh: 42, riskyLow: 10, badLow: 5 },
    tips: {
      base: [
        { icon: '🐄', text: 'Rotate grazing areas to prevent overgrazing and allow pasture recovery.' },
        { icon: '💧', text: 'Ensure livestock have access to clean water especially during warm weather.' },
        { icon: '🌿', text: 'Avoid grazing wet pastures — hooves churn up and damage waterlogged soil.' },
      ],
      rain:     'Heavy rain and waterlogged pastures damage soil structure and expose livestock to mud fever.',
      wind:     'Strong wind causes stress in livestock, especially young animals.',
      humidity: 'Very high humidity combined with heat causes heat stress in cattle and other livestock.',
      heat:     'Provide shade and extra water during extreme heat — limit grazing to early morning and evening.',
    },
  },
}

const GENERIC_OUTDOOR_PROFILE = {
  name: 'Outdoor Farm Task',
  rain:     { risky: 40, bad: 70 },
  wind:     { risky: 30, bad: 50 },
  humidity: { risky: 88, bad: 95 },
  temp:     { riskyHigh: 38, badHigh: 42, riskyLow: 10, badLow: 5 },
  tips: {
    base: [
      { icon: '🌤', text: 'Monitor weather conditions closely during your task and be ready to stop if conditions worsen.' },
      { icon: '💧', text: 'Stay hydrated and take breaks during warm or humid conditions.' },
      { icon: '🌾', text: 'Have a contingency plan ready in case weather deteriorates unexpectedly.' },
    ],
    rain:     'Rain may disrupt your outdoor farm task — consider rescheduling or preparing cover.',
    wind:     'Strong wind can interfere with many outdoor farm activities.',
    humidity: 'Very high humidity makes physical farm work uncomfortable and increases health risks.',
    heat:     'Extreme heat increases heat exhaustion risk — work during cooler hours.',
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

export function analyzeFeasibility(taskName, startTime, startMode, durationValue, hourlyData) {
  const profile = getActivityProfile(taskName)
  const window = getWeatherWindow(startTime, durationValue, hourlyData, startMode)

  if (window.length === 0) {
    return {
      verdict: 'good',
      verdictLabel: 'Good to Go!',
      verdictSub: `No weather data available for the selected window. Conditions assumed favorable.`,
      hourly: [],
      factors: buildFactors([]),
      bestTime: null,
      tips: profile.tips.base,
      profile,
    }
  }

  const verdict = determineVerdict(window, profile)
  const bestWindow = findBestWindow(hourlyData, durationValue, profile, startTime, startMode)
  const showBestWindow = verdict !== 'good' ? bestWindow : null
  const tips = buildTips(profile, window)

  return {
    verdict,
    verdictLabel: getVerdictLabel(verdict),
    verdictSub: getVerdictSub(verdict, profile, window),
    hourly: window,
    factors: buildFactors(window),
    bestTime: showBestWindow,
    tips,
    profile,
  }
}

function getWeatherWindow(startTime, durationValue, hourlyData, startMode) {
  const durationHours = parseDurationMax(durationValue)
  const startDate = getStartDate(startTime, startMode)
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000)

  // console.log('startDate:', startDate)
  // console.log('endDate:', endDate)
  // console.log('first hourly time:', hourlyData[0]?.time)

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

function determineVerdict(window, profile) {
  for (const hour of window) {
    if (
      hour.rain     >= profile.rain.bad     ||
      hour.wind     >= profile.wind.bad     ||
      hour.humidity >= profile.humidity.bad ||
      hour.temp     >= profile.temp.badHigh ||
      hour.temp     <= profile.temp.badLow
    ) return 'bad'
  }

  for (const hour of window) {
    if (
      hour.rain     >= profile.rain.risky     ||
      hour.wind     >= profile.wind.risky     ||
      hour.humidity >= profile.humidity.risky ||
      hour.temp     >= profile.temp.riskyHigh ||
      hour.temp     <= profile.temp.riskyLow
    ) return 'risky'
  }

  return 'good'
}

function findBestWindow(hourlyData, durationValue, profile, startTime, startMode) {
  const duration = parseDurationMax(durationValue)
  const now = getStartDate(startTime, startMode)

  const futureHours = hourlyData.filter(h => {
    const hTime = new Date(h.time + ':00+08:00')
    const hour = hTime.getHours()
    return hTime >= now && hour >= 6 && hour < 18
  })

  let bestStart = null
  let bestScore = Infinity

  for (let i = 0; i <= futureHours.length - duration; i++) {
    const window = futureHours.slice(i, i + duration)

    // skip windows that bleed into nighttime
    const windowEnd = new Date(new Date(window[0].time + ':00+08:00').getTime() + duration * 60 * 60 * 1000)
    if (windowEnd.getHours() > 18) continue

    const score = window.reduce((sum, h) => (
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

  const isToday = startDate.toDateString() === today.toDateString()
  const isTomorrow = startDate.toDateString() === tomorrow.toDateString()

  let dayLabel
  if (isToday) {
    dayLabel = 'Today'
  } else if (isTomorrow) {
    dayLabel = 'Tomorrow'
  } else {
    dayLabel = startDate.toLocaleDateString('en-PH', { weekday: 'long', month: 'short', day: 'numeric' })
  }

  return {
    label: `${dayLabel}, ${formatTime(startDate)} – ${formatTime(endDate)}`,
    rain: Math.round(bestStart.rain),
    wind: Math.round(bestStart.wind),
    humidity: Math.round(bestStart.humidity),
    isToday,
    isTomorrow,
  }
}

function formatTime(date) {
  return date.toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function buildFactors(window) {

  if (window.length === 0) return [
    { icon: '🌧', label: 'Rain',     value: 'N/A', level: 'ok' },
    { icon: '💨', label: 'Wind',     value: 'N/A', level: 'ok' },
    { icon: '💧', label: 'Humidity', value: 'N/A', level: 'ok' },
    { icon: '🌡', label: 'Temp',     value: 'N/A', level: 'ok' },
  ]
  const maxRain = Math.max(...window.map(h => h.rain))
  const maxWind = Math.max(...window.map(h => h.wind))
  const maxHumidity = Math.max(...window.map(h => h.humidity))
  const avgTemp = Math.round(window.reduce((s, h) => s + h.temp, 0) / window.length)

  return [
    { icon: '🌧', label: 'Rain',     value: `${maxRain}%`,      level: getRainLevel(maxRain)         },
    { icon: '💨', label: 'Wind',     value: `${maxWind}km/h`,   level: getWindLevel(maxWind)         },
    { icon: '💧', label: 'Humidity', value: `${maxHumidity}%`,  level: getHumidityLevel(maxHumidity) },
    { icon: '🌡', label: 'Temp',     value: `${avgTemp}°C`,     level: getTempLevel(avgTemp)         },
  ]
}

function getRainLevel(v)     { return v >= 60 ? 'bad' : v >= 35 ? 'warn' : 'ok' }
function getWindLevel(v)     { return v >= 40 ? 'bad' : v >= 25 ? 'warn' : 'ok' }
function getHumidityLevel(v) { return v >= 90 ? 'bad' : v >= 80 ? 'warn' : 'ok' }
function getTempLevel(v)     { return v >= 38 ? 'bad' : v >= 34 ? 'warn' : 'ok' }

function buildTips(profile, window) {
  const tips = [...profile.tips.base]
  const maxRain = Math.max(...window.map(h => h.rain))
  const maxWind = Math.max(...window.map(h => h.wind))
  const maxHumidity = Math.max(...window.map(h => h.humidity))
  const maxTemp = Math.max(...window.map(h => h.temp))

  if (maxRain >= profile.rain.risky)
    tips.push({ icon: '🌧', text: `${profile.tips.rain} (Peak rain chance: ${maxRain}%)` })
  if (maxWind >= profile.wind.risky)
    tips.push({ icon: '💨', text: `${profile.tips.wind} (Peak wind: ${maxWind} km/h)` })
  if (maxHumidity >= profile.humidity.risky)
    tips.push({ icon: '💧', text: `${profile.tips.humidity} (Peak humidity: ${maxHumidity}%)` })
  if (maxTemp >= profile.temp.riskyHigh)
    tips.push({ icon: '🌡', text: `${profile.tips.heat} (Peak temp: ${maxTemp}°C)` })

  return tips
}

function getVerdictLabel(verdict) {
  if (verdict === 'good')  return 'Good to Go!'
  if (verdict === 'risky') return 'Risky — Proceed with Caution'
  return 'Not Recommended — Consider Rescheduling'
}

function getVerdictSub(verdict, profile, window) {
  if (verdict === 'good') return `Conditions look favorable for ${profile.name}.`

  const issues = []
  const maxRain = Math.max(...window.map(h => h.rain))
  const maxWind = Math.max(...window.map(h => h.wind))
  const maxHumidity = Math.max(...window.map(h => h.humidity))
  const maxTemp = Math.max(...window.map(h => h.temp))

  if (maxRain >= (verdict === 'bad' ? profile.rain.bad : profile.rain.risky))
    issues.push(`high rain chance (${maxRain}%)`)
  if (maxWind >= (verdict === 'bad' ? profile.wind.bad : profile.wind.risky))
    issues.push(`strong wind (${maxWind} km/h)`)
  if (maxHumidity >= (verdict === 'bad' ? profile.humidity.bad : profile.humidity.risky))
    issues.push(`high humidity (${maxHumidity}%)`)
  if (maxTemp >= (verdict === 'bad' ? profile.temp.badHigh : profile.temp.riskyHigh))
    issues.push(`extreme heat (${maxTemp}°C)`)

  return issues.length > 0
    ? `Due to ${issues.join(' and ')} in your window.`
    : `Conditions are borderline for ${profile.name}.`
}