import { useState, useRef, useEffect } from 'react'
import { searchLocation } from '../utils/nominatim'
import './Header.css'

export default function Header({ onLocationSelect, locationLabel }) {
  const [query, setQuery] = useState(locationLabel || '')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef(null)
  const wrapRef = useRef(null)
  const [searchError, setSearchError] = useState(false)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    setOpen(true)

    clearTimeout(debounceRef.current)
    if (val.trim().length < 3) {
      setSuggestions([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setSearchError(false)
      try {
        const results = await searchLocation(val)
        setSuggestions(results)
        if (results.length === 0) setSearchError(true)
      } catch {
        setSuggestions([])
        setSearchError(true)
      } finally {
        setLoading(false)
      }
    }, 500)
  }

  const handleSelect = (loc) => {
    setQuery(loc.shortLabel)
    setSuggestions([])
    setOpen(false)
    onLocationSelect(loc)
  }

  return (
    <header className="header">
      <div className="header__logo">
        <div className="header__logo-icon">🌾</div>
        <div className="header__logo-wrap">
          <span className="header__logo-text">BukidCheck</span>
          <span className="header__logo-tagline">Farm Task Weather Planner</span>
        </div>
      </div>

      <div className="header__location-wrap" ref={wrapRef}>
        <div className={`header__location-input ${open && suggestions.length ? 'header__location-input--open' : ''}`}>
          <span className="header__location-icon">📍</span>
          <input
            className="header__location-field"
            type="text"
            placeholder="Enter your location..."
            value={query}
            onChange={handleChange}
            onFocus={() => suggestions.length && setOpen(true)}
          />
          {loading && <span className="header__location-spinner" />}
        </div>

        {open && suggestions.length > 0 && (
          <div className="header__dropdown">
            {suggestions.map(loc => (
              <button
                key={loc.id}
                className="header__suggestion"
                onClick={() => handleSelect(loc)}
              >
                <span className="header__suggestion-icon">📍</span>
                <div className="header__suggestion-text">
                  <span className="header__suggestion-short">{loc.shortLabel}</span>
                  <span className="header__suggestion-full">{loc.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {searchError && !loading && query.trim().length >= 3 && (
          <div className="header__search-error">
            No locations found. Try a different search.
          </div>
        )}
      </div>
    </header>
  )
}