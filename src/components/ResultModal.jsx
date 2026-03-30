import { useState, useEffect } from 'react'
import { analyzeFeasibility, buildFactors, isNightTime} from '../utils/feasibility'
import './ResultModal.css'

const LOADING_STEPS = [
  { icon: '🌤', text: 'Fetching weather forecast...'      },
  { icon: '🌡', text: 'Reading temperature & humidity...' },
  { icon: '💨', text: 'Checking wind conditions...'       },
  { icon: '🌧', text: 'Analyzing rain probability...'     },
  { icon: '🌾', text: 'Evaluating task feasibility...'    },
  { icon: '✔️', text: 'Preparing your recommendation...'  },
]

const VERDICT_CONFIG = {
  good:    { emoji: '✅', className: 'good'    },
  caution: { emoji: '⚠️', className: 'caution' },
  risky:   { emoji: '⚠️', className: 'risky'   },
  bad:     { emoji: '❌', className: 'bad'      },
}

export default function ResultModal({ task, duration, startTime, startMode, weather, onClose }) {
  const [loading, setLoading] = useState(true)
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)

  const resolvedStartTime = startMode === 'now'
    ? `${String(new Date().getHours()).padStart(2,'0')}:${String(new Date().getMinutes()).padStart(2,'0')}`
    : startTime

  useEffect(() => {
    const stepDuration = 4800 / LOADING_STEPS.length

    const stepInterval = setInterval(() => {
      setStepIndex(prev => {
        const next = prev + 1
        if (next >= LOADING_STEPS.length) { clearInterval(stepInterval); return prev }
        return next
      })
    }, stepDuration)

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(progressInterval); return 100 }
        return prev + 1
      })
    }, 50)

    const doneTimer = setTimeout(() => {
      if (isNightTime(startTime, startMode)) {
        setResult({ nightMode: true })
        setLoading(false)
        return
      }

      try {
        const analysis = analyzeFeasibility(
          task,
          resolvedStartTime,
          startMode,
          duration,
          weather.hourly
        )
        setResult(analysis)
      } catch (e) {
        setResult({
          verdict: 'good',
          verdictLabel: 'Unable to analyze',
          verdictSub: 'Something went wrong. Please close and try again.',
          hourly: [],
          factors: buildFactors([], {}),
          bestTime: null,
          tips: [{ icon: '🌾', text: 'Please close this and try again with a different task or location.' }],
          profile: null,
          nightMode: false,
        })
      } finally {
        setLoading(false)
      }
    }, 5200)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
      clearTimeout(doneTimer)
    }
  }, [])

  const config = result && !result.nightMode ? VERDICT_CONFIG[result.verdict] : null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div className="modal__task-info">
            <span className="modal__task-name">{task}</span>
            <span className="modal__task-duration">
              · {duration} hrs
              · {startMode === 'now' ? 'Starting now' : `Starting at ${new Date(`1970-01-01T${startTime}`).toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true })}`}
            </span>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <div className="modal__loading">
            <span className="modal__loading-icon">{LOADING_STEPS[stepIndex].icon}</span>
            <p className="modal__loading-text" key={stepIndex}>
              {LOADING_STEPS[stepIndex].text}
            </p>
            <div className="modal__progress-wrap">
              <div className="modal__progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <span className="modal__progress-label">{progress}%</span>
            <p className="modal__loading-sub">Analyzing weather for your farm task...</p>
          </div>
        ) : result && result.nightMode ? (
          <div className="modal__night">
            <div className="modal__night-icon">🌙</div>
            <h3 className="modal__night-title">Rest well, Mahal na Magsasaka.</h3>
            <p className="modal__night-message">
              It's past 8 PM — time to put down your tools. Farmers like you are the
              backbone of this country, and you deserve a well-earned rest tonight.
            </p>
            <p className="modal__night-family">
              Spend some time with your family. The fields will still be there tomorrow. 🌾
            </p>
            <div className="modal__night-divider" />
            <p className="modal__night-plan">
              Come back tomorrow and we'll help you plan your day right — starting at the best time for <strong>{task}</strong>.
            </p>
          </div>
        ) : result && (
          <div className="modal__scroll">

            <div className={`modal__verdict modal__verdict--${config.className}`}>
              <div className={`modal__verdict-icon modal__verdict-icon--${config.className}`}>
                {config.emoji}
              </div>
              <div>
                <div className="modal__verdict-title">{result.verdictLabel}</div>
                <div className="modal__verdict-sub">{result.verdictSub}</div>
              </div>
            </div>

            {result.hourly.length > 0 && (
              <div className="modal__section">
                <div className="modal__section-label">
                  Hourly Forecast · {result.hourly.length} hour window
                </div>
                <div className="modal__hour-strip">
                  {result.hourly.slice(0, 6).map((h, i) => (
                    <div key={i} className={`modal__hour modal__hour--${h.level}`}>
                      <div className="modal__hour-time">{h.label}</div>
                      <div className="modal__hour-icon">{h.icon}</div>
                      <div className="modal__hour-temp">{h.temp}°</div>
                      <div className={`modal__hour-rain modal__hour-rain--${h.level}`}>{h.rain}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal__factors">
              {result.factors.map((f, i) => (
                <div key={i} className="modal__factor">
                  <div className="modal__factor-icon">{f.icon}</div>
                  <div className="modal__factor-label">{f.label}</div>
                  <div className="modal__factor-value">{f.value}</div>
                  <div className={`modal__factor-badge modal__factor-badge--${f.level}`}>
                    {f.level === 'ok' ? 'Good' : f.level === 'warn' ? 'Moderate' : 'High'}
                  </div>
                </div>
              ))}
            </div>

            {result.bestTime && (
              <div className={`modal__best-time modal__best-time--${result.verdict}`}>
                <span className="modal__best-time-icon">💡</span>
                <div>
                  <div className="modal__best-time-title">
                    Better window: {result.bestTime.label}
                  </div>
                  <div className="modal__best-time-sub">
                    Rain {result.bestTime.rain}% · Wind {result.bestTime.wind} km/h · Humidity {result.bestTime.humidity}% · Heat Index {result.bestTime.hi}°C
                    {result.bestTime.skyCover && ` · Sky: ${result.bestTime.skyCover}`}
                    {' '}— consider rescheduling to this window for better results.
                  </div>
                </div>
              </div>
            )}

            <div className="modal__tips">
              <div className="modal__section-label">Farming Tips</div>
              {result.tips.map((tip, i) => (
                <div key={i} className="modal__tip">
                  <span className="modal__tip-icon">{tip.icon}</span>
                  <span className="modal__tip-text">{tip.text}</span>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}