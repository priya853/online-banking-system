import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      setError('Please fill in all fields.')
      return
    }

    if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            password: form.password,
          }),
        }
      )

      const responseText = await response.text()

      let data = responseText

      try {
        data = JSON.parse(responseText)
      } catch {
        // Plain text response
      }

      if (!response.ok) {
        const message =
          typeof data === 'string'
            ? data || `Registration failed (${response.status})`
            : data.message ||
              data.error ||
              `Registration failed (${response.status})`

        throw new Error(message)
      }

      setSuccess(
        'Customer registered successfully. Redirecting to login...'
      )

      setForm({
        name: '',
        email: '',
        phone: '',
        password: '',
      })

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the backend. Check Spring Boot and CORS.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <header className="register-header">
        <div className="register-logo">
          <span className="register-logo-icon" aria-hidden="true"></span>
          <strong>Online Banking</strong>
        </div>

        <span className="register-header-text">
          Customer Registration
        </span>
      </header>

      <main className="register-main">
        <div className="register-title-bar">
          <span className="register-eyebrow">ACCOUNT ACCESS</span>
          <h1>Register Customer</h1>
          <p>Create your Online Banking account securely.</p>
        </div>

        <div className="register-card">
          <div className="register-card-heading">
            <span className="register-card-label">CUSTOMER ACCOUNT</span>
            <h2>Customer Registration</h2>
            <p>
              Enter your personal details to create a new customer account.
            </p>
          </div>

          {error && (
            <div className="register-message register-error">
              <strong>Registration Error</strong>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="register-message register-success">
              <strong>Registration Successful</strong>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="register-name">
                Full Name
              </label>

              <input
                id="register-name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-email">
                Email Address
              </label>

              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-phone">
                Phone Number
              </label>

              <input
                id="register-phone"
                name="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={form.phone}
                onChange={handleChange}
                maxLength="10"
                inputMode="numeric"
                autoComplete="tel"
              />

              <span className="register-field-hint">
                Enter exactly 10 digits.
              </span>
            </div>

            <div className="register-field">
              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <span className="register-field-hint">
                Minimum 6 characters.
              </span>
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="register-login-link">
            Already have an account?{' '}
            <Link to="/login">
              Login here
            </Link>
          </div>

          <div className="register-security">
            <div className="register-security-icon">!</div>

            <div>
              <strong>Security Notice</strong>
              <p>
                Use a strong password and never share your password or OTP
                with anyone.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="register-footer">
        &#169; 2026 Online Banking. All Rights Reserved.
      </footer>
    </div>
  )
}

export default Register