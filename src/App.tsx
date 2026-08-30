import { useEffect, useState } from 'react'
import './App.css'
import { API_URL, getHealth } from './lib/api'

function App() {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: 40, fontFamily: 'Inter, system-ui' }}>
      <h1>KOS RegTech Enterprise Hub</h1>
      <p>Frontend: kos-app-master → API: <code>{API_URL}</code></p>

      <div style={{ 
        padding: 20, 
        borderRadius: 12, 
        background: '#0f172a', 
        color: 'white',
        marginTop: 20,
        maxWidth: 600
      }}>
        <h2 style={{ margin: 0 }}>API Status</h2>
        {loading && <p>Checking...</p>}
        {error && <p style={{ color: '#f87171' }}>❌ {error}</p>}
        {health && (
          <pre style={{ 
            background: '#1e293b', 
            padding: 12, 
            borderRadius: 8,
            overflow: 'auto',
            marginTop: 12
          }}>
            {JSON.stringify(health, null, 2)}
          </pre>
        )}
        {health?.status === 'ONLINE' && (
          <p style={{ color: '#4ade80', fontWeight: 'bold' }}>✅ ONLINE - Version {health.version}</p>
        )}
      </div>

      <div style={{ marginTop: 30 }}>
        <a href={`${API_URL}/health`} target="_blank">/health</a> |{' '}
        <a href={`${API_URL}/api`} target="_blank">/api</a> |{' '}
        <a href={`${API_URL}/api/status`} target="_blank">/api/status</a>
      </div>
    </div>
  )
}

export default App
