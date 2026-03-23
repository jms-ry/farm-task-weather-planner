import { useState, useRef, useEffect } from 'react'
import { sendMessage } from '../utils/api'
import { buildSystemPrompt, buildScoringPrompt } from '../utils/prompts'
import ResultsScreen from './ResultsScreen'
import './InterviewModal.css'

const PHASE = {
  INTRO: 'INTRO',
  IN_PROGRESS: 'IN_PROGRESS',
  AWAITING_SCORE_REQUEST: 'AWAITING_SCORE_REQUEST',
  SCORING: 'SCORING',
  RESULTS: 'RESULTS',
}

function parseQuestionCount(value) {
  if (value === '6') return 6
  if (value === '4-5') return 5
  return 3
}

export default function InterviewModal({ config, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [phase, setPhase] = useState(PHASE.INTRO)
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const totalQuestions = parseQuestionCount(config.questionCount)
  const systemPrompt = buildSystemPrompt(config.position, totalQuestions)

  useEffect(() => {
    startIntro()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const startIntro = async () => {
    setIsTyping(true)
    try {
      const introMessages = [{ role: 'user', content: 'Start the interview introduction.' }]
      const reply = await sendMessage(systemPrompt, introMessages)
      setMessages([{ role: 'assistant', content: reply }])
    } catch (e) {
      setError('Failed to connect. Please try again.')
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isTyping || phase === PHASE.SCORING || phase === PHASE.RESULTS) return

    const userMessage = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsTyping(true)
    setError(null)

    try {
      if (phase === PHASE.AWAITING_SCORE_REQUEST) {
        const lower = text.toLowerCase()
        const wantsScore = ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'show', 'view'].some(w => lower.includes(w))
        if (wantsScore) {
          setPhase(PHASE.SCORING)
          setIsTyping(false)
          await fetchResults(updatedMessages)
          return
        }
      }

      const reply = await sendMessage(systemPrompt, updatedMessages)
      const assistantMessage = { role: 'assistant', content: reply }
      const newMessages = [...updatedMessages, assistantMessage]
      setMessages(newMessages)

      if (phase === PHASE.INTRO) {
        const lower = reply.toLowerCase()
        const isAsking = ['ready', 'shall we', 'begin', 'start'].some(w => lower.includes(w))
        if (isAsking) setPhase(PHASE.IN_PROGRESS)
      }

      if (phase === PHASE.IN_PROGRESS) {
        const newCount = questionsAsked + 1
        setQuestionsAsked(newCount)
        if (newCount >= totalQuestions) {
          setPhase(PHASE.AWAITING_SCORE_REQUEST)
        }
      }

    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  const fetchResults = async (allMessages) => {
    try {
      const scoringPrompt = buildScoringPrompt(config.position, allMessages)
      const reply = await sendMessage(scoringPrompt, [
        { role: 'user', content: 'Evaluate this interview and return the JSON.' }
      ])
      const parsed = JSON.parse(reply)
      setResults(parsed)
      setPhase(PHASE.RESULTS)
    } catch (e) {
      setError('Failed to generate results. Please try again.')
      setPhase(PHASE.AWAITING_SCORE_REQUEST)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const progressPercent = phase === PHASE.RESULTS
    ? 100
    : Math.round((questionsAsked / totalQuestions) * 100)

  if (phase === PHASE.RESULTS && results) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal__header">
            <div className="modal__interviewer">
              <div className="modal__avatar">A</div>
              <div className="modal__interviewer-info">
                <span className="modal__interviewer-name">Alex</span>
                <span className="modal__interviewer-role">AI Interviewer · InterviewAI</span>
              </div>
            </div>
            <div className="modal__header-right">
              <div className="modal__position-badge">{config.position}</div>
            </div>
          </div>
          <div className="modal__progress-bar">
            <div className="modal__progress-fill" style={{ width: '100%' }} />
          </div>
          <ResultsScreen results={results} onRetry={onClose} />
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={handleCloseAttempt}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div className="modal__interviewer">
            <div className="modal__avatar">A</div>
            <div className="modal__interviewer-info">
              <span className="modal__interviewer-name">Alex</span>
              <span className="modal__interviewer-role">AI Interviewer · InterviewAI</span>
            </div>
          </div>
          <div className="modal__header-right">
            <div className="modal__position-badge">{config.position}</div>
            {phase === PHASE.IN_PROGRESS && (
              <div className="modal__question-counter">
                {questionsAsked + 1} / {totalQuestions}
              </div>
            )}
            <button className="modal__close-btn" onClick={handleCloseAttempt}>✕</button>
          </div>
        </div>

        <div className="modal__progress-bar">
          <div className="modal__progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="modal__messages">
          {messages.map((msg, i) => (
            <div key={i} className={`modal__message modal__message--${msg.role}`}>
              {msg.role === 'assistant' && <div className="modal__msg-avatar">A</div>}
              <div className="modal__bubble">
                <p>{msg.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="modal__message modal__message--assistant">
              <div className="modal__msg-avatar">A</div>
              <div className="modal__bubble modal__bubble--typing">
                <span className="modal__dot" />
                <span className="modal__dot" />
                <span className="modal__dot" />
              </div>
            </div>
          )}

          {error && (
            <div className="modal__error">{error}</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {phase === PHASE.SCORING && (
          <div className="modal__scoring">
            <div className="modal__scoring-dots">
              <span className="modal__dot" />
              <span className="modal__dot" />
              <span className="modal__dot" />
            </div>
            <p>Analyzing your interview...</p>
          </div>
        )}

        {phase !== PHASE.SCORING && (
          <div className="modal__input-area">
            <textarea
              ref={inputRef}
              className="modal__textarea"
              placeholder={phase === PHASE.AWAITING_SCORE_REQUEST ? 'Type "yes" to view your results...' : 'Type your answer...'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isTyping || phase === PHASE.RESULTS}
            />
            <button
              className={`modal__send-btn ${input.trim() && !isTyping ? 'modal__send-btn--active' : ''}`}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              ↑
            </button>
          </div>
        )}

      </div>

      {showExitConfirm && (
        <div className="modal-confirm-overlay" onClick={e => e.stopPropagation()}>
          <div className="modal-confirm">
            <h3 className="modal-confirm__title">End this interview?</h3>
            <p className="modal-confirm__desc">Your progress and answers will not be saved.</p>
            <div className="modal-confirm__actions">
              <button className="modal-confirm__btn modal-confirm__btn--cancel" onClick={() => setShowExitConfirm(false)}>
                Keep going
              </button>
              <button className="modal-confirm__btn modal-confirm__btn--exit" onClick={onClose}>
                End interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  function handleCloseAttempt() {
    if (phase === PHASE.RESULTS) { onClose(); return }
    setShowExitConfirm(true)
  }
}