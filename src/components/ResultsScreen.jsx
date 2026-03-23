export default function ResultsScreen({ results, onRetry }) {
  return (
    <div style={{ padding: '2rem', color: 'var(--cream)', overflowY: 'auto', flex: 1 }}>
      <pre style={{ fontSize: '0.75rem', opacity: 0.7, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(results, null, 2)}
      </pre>
      <button onClick={onRetry} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--amber)', border: 'none', borderRadius: '8px', color: 'var(--navy)', cursor: 'pointer', fontWeight: 600 }}>
        Try Again
      </button>
    </div>
  )
}