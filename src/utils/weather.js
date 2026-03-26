const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast'

export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'wind_speed_10m',
      'precipitation_probability',
      'weather_code',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
      'relative_humidity_2m',
    ].join(','),
    timezone: 'Asia/Manila',
    forecast_days: 2,
  })

  const response = await fetch(`${OPEN_METEO_URL}?${params}`)
  if (!response.ok) throw new Error('Weather fetch failed')

  const data = await response.json()
  return mapWeatherData(data)
}

function mapWeatherData(data) {
  const c = data.current
  const code = c.weather_code
  const hour = new Date().getHours()

  return {
    current: {
      temp: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m,
      wind: Math.round(c.wind_speed_10m),
      rain: c.precipitation_probability,
      description: getDescription(code),
      icon: getIconForTime(code, hour),
    },
    hourly: mapHourly(data.hourly),
  }
}

function mapHourly(hourly) {
  const now = new Date()
  const results = []

  for (let i = 0; i < hourly.time.length; i++) {
    const time = new Date(hourly.time[i] + ':00+08:00')
    if (time < now) continue
    if (results.length >= 24) break

    const hour = time.getHours()

    results.push({
      time: hourly.time[i],
      label: formatHourLabel(time),
      temp: Math.round(hourly.temperature_2m[i]),
      rain: hourly.precipitation_probability[i],
      wind: Math.round(hourly.wind_speed_10m[i]),
      humidity: hourly.relative_humidity_2m[i],
      code: hourly.weather_code[i],
      icon: getIconForTime(hourly.weather_code[i], hour),
      level: getRainLevel(hourly.precipitation_probability[i]),
    })
  }

  return results
}

function formatHourLabel(date) {
  return date.toLocaleTimeString('en-PH', {
    hour: 'numeric',
    hour12: true,
  }).replace(':00', '').trim()
}

function getRainLevel(prob) {
  if (prob >= 60) return 'bad'
  if (prob >= 35) return 'warn'
  return 'ok'
}

function getDescription(code) {
  if (code === 0)              return 'Clear Sky'
  if (code <= 2)               return 'Partly Cloudy'
  if (code === 3)              return 'Overcast'
  if (code <= 49)              return 'Foggy'
  if (code <= 59)              return 'Drizzle'
  if (code <= 69)              return 'Rainy'
  if (code <= 79)              return 'Snowy'
  if (code <= 84)              return 'Rain Showers'
  if (code <= 94)              return 'Thunderstorm'
  return 'Stormy'
}

export function getIconForTime(code, hour) {
  const isNight = hour !== undefined && (hour >= 18 || hour < 6)

  if (code === 0)  return isNight ? '🌙' : '☀️'
  if (code <= 2)   return isNight ? '🌙' : '⛅'
  if (code === 3)  return '☁️'
  if (code <= 49)  return '🌫'
  if (code <= 59)  return '🌦'
  if (code <= 69)  return '🌧'
  if (code <= 79)  return '❄️'
  if (code <= 84)  return '🌦'
  if (code <= 94)  return '⛈'
  return '🌩'
}