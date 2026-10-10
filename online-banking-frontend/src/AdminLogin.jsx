import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

function getRoleFromJwt(jwtToken) {
  try {
    const payloadPart = jwtToken.split('.')[1]
    if (!payloadPart) return ''
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    const payload = JSON.parse(atob(padded))
    const directRole = payload.role || payload.userRole || payload.authority
    if (typeof directRole === 'string' && directRole.trim()) return directRole.trim()
    for (const key of ['roles', 'authorities']) {
      const value = payload[key]
      if (Array.isArray(value)) {
        const str = value.find((item) => typeof item === 'string' && item.trim())
        if (str) return str.trim()
        const obj = value.find((item) => item && typeof item.authority === 'string')
        if (obj) return obj.authority.trim()
      }
    }
  } catch {
    // Backend role is preferred; JWT decoding is only a compatibility fallback.
  }
  return ''
}

function normalizeRole(role) {
  const value = String(role || '').trim().toUpperCase()
  if (value === 'ADMIN' || value === 'ROLE_ADMIN') return 'ROLE_ADMIN'
  if (value === 'BANK' || value === 'ROLE_BANK') return 'ROLE_BANK'
  if (value === 'USER' || value === 'ROLE_USER' || value === 'CUSTOMER' || value === 'ROLE_CUSTOMER') return 'ROLE_CUSTOMER'
  return ''
}

function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter your admin email and password.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const responseText = await response.text()
      let data = responseText
      try { data = JSON.parse(responseText) } catch { /* plain text */ }

      if (!response.ok) {
        const message = typeof data === 'string'
          ? data || `Login failed (${response.status})`
          : data.message || data.error || `Login failed (${response.status})`
        throw new Error(message)
      }

      const token = typeof data === 'string'
        ? data.replace(/^"|"$/g, '')
        : data.token || data.jwt || data.accessToken

      if (!token) throw new Error('Login response received, but JWT token was not found.')

      const role = normalizeRole(
        (typeof data === 'object' ? data.role || data.userRole || data.authority : '') || getRoleFromJwt(token)
      )

      if (role !== 'ROLE_ADMIN') {
        throw new Error('This login is only for ADMIN users. Please use the customer login page for customer accounts.')
      }

      const name = typeof data === 'object' ? data.name || '' : ''
      sessionStorage.setItem('jwtToken', token)
      sessionStorage.setItem('userRole', 'ROLE_ADMIN')
      if (name) sessionStorage.setItem('userName', name)
      onLoginSuccess('ROLE_ADMIN')
    } catch (err) {
      setError(err.message === 'Failed to fetch'
        ? 'Cannot connect to the backend. Check Spring Boot and CORS.'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-logo"><span>🏦</span><strong>Online Banking</strong></div>
        <span className="login-header-text">Admin Secure Portal</span>
      </header>
      <main className="login-main">
        <div className="login-title-bar">
          <h1>Admin Login</h1>
          <p>Authorized administrator access only</p>
        </div>
        <div className="login-card">
          <div className="login-card-heading">
            <h2>Administrator Sign In</h2>
            <p>Enter your administrator credentials.</p>
          </div>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="admin-email">Admin Email</label>
              <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
            </div>
            <div className="login-field">
              <label htmlFor="admin-password">Password</label>
              <div className="login-password-box">
                <input id="admin-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Login as Admin'}
            </button>
          </form>
          <div className="login-register-link">
            <Link to="/login">← Customer / Bank Login</Link>
          </div>
        </div>
      </main>
      <footer className="login-footer">© 2026 Online Banking. Administrator access is restricted.</footer>
    </div>
  )
}

export default AdminLogin
