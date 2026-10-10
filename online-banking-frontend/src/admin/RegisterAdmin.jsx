import { useState } from 'react'
import AdminPageLayout from './AdminPageLayout'

const EMPTY_FORM = { name: '', email: '', password: '', confirmPassword: '' }

function RegisterAdmin({ onLogout }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setMessage('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password do not match.')
      return
    }

    const token = sessionStorage.getItem('jwtToken')
    if (!token) {
      setError('Your session has expired. Please log in again.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('http://localhost:8080/api/admin/admins', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.message || payload.error || `Registration failed (${response.status}).`)
      }
      setMessage(`Admin account created successfully for ${payload.email}.`)
      setForm(EMPTY_FORM)
    } catch (requestError) {
      setError(requestError.message || 'Unable to register admin. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminPageLayout
      title="Register Admin"
      subtitle="Create an additional administrator account. Only logged-in administrators can access this page."
      onLogout={onLogout}
    >
      <div className="bank-panel">
        <h2 className="bank-section-title">Admin Registration</h2>
        {message && <div className="bank-success" role="status">{message}</div>}
        {error && <div className="bank-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="bank-form-grid">
            <div className="bank-field">
              <label htmlFor="admin-name">Full Name</label>
              <input id="admin-name" name="name" type="text" autoComplete="name" placeholder="Enter full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="bank-field">
              <label htmlFor="admin-email">Email Address</label>
              <input id="admin-email" name="email" type="email" autoComplete="email" placeholder="Enter email address" value={form.email} onChange={handleChange} required />
            </div>
            <div className="bank-field">
              <label htmlFor="admin-password">Password</label>
              <input id="admin-password" name="password" type="password" autoComplete="new-password" minLength={8} placeholder="Minimum 8 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="bank-field">
              <label htmlFor="admin-confirm-password">Confirm Password</label>
              <input id="admin-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          <div className="bank-button-row">
            <button type="submit" className="bank-button" disabled={submitting}>
              {submitting ? 'Creating Admin...' : 'Register Admin'}
            </button>
            <button type="button" className="bank-button secondary" disabled={submitting} onClick={() => { setForm(EMPTY_FORM); setMessage(''); setError('') }}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  )
}

export default RegisterAdmin
