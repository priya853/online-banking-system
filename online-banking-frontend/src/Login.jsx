import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './Login.css'

function Login({ onLoginSuccess }) {
  const location = useLocation()
  const currentPath = location.pathname

  const isAdminLogin = currentPath === '/admin/login'
  const isBankLogin = currentPath === '/bank/login'

  const initialRole = isAdminLogin
    ? 'ROLE_ADMIN'
    : isBankLogin
      ? 'ROLE_BANK'
      : ''

  const [selectedRole, setSelectedRole] = useState(initialRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function normalizeRole(role) {
    const value = String(role || '').trim().toUpperCase()

    if (value === 'ADMIN' || value === 'ROLE_ADMIN') {
      return 'ROLE_ADMIN'
    }

    if (value === 'BANK' || value === 'ROLE_BANK') {
      return 'ROLE_BANK'
    }

    if (
      value === 'CUSTOMER' ||
      value === 'ROLE_CUSTOMER' ||
      value === 'USER' ||
      value === 'ROLE_USER'
    ) {
      return 'ROLE_CUSTOMER'
    }

    return value
  }

  function getRoleFromJwt(token) {
    try {
      if (!token) return ''

      const parts = token.split('.')

      if (parts.length < 2) {
        return ''
      }

      const normalized = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')

      const padded = normalized.padEnd(
        normalized.length +
          ((4 - (normalized.length % 4)) % 4),
        '='
      )

      const payload = JSON.parse(
        atob(padded)
      )

      const directRole =
        payload.role ||
        payload.userRole ||
        payload.authority

      if (
        typeof directRole === 'string' &&
        directRole.trim()
      ) {
        return normalizeRole(directRole)
      }

      const arrays = [
        payload.roles,
        payload.authorities
      ]

      for (const value of arrays) {
        if (!Array.isArray(value)) {
          continue
        }

        const stringRole = value.find(
          (item) =>
            typeof item === 'string' &&
            item.trim()
        )

        if (stringRole) {
          return normalizeRole(stringRole)
        }

        const objectRole = value.find(
          (item) =>
            item &&
            typeof item.authority === 'string'
        )

        if (objectRole) {
          return normalizeRole(
            objectRole.authority
          )
        }
      }
    } catch {
      return ''
    }

    return ''
  }

  function validateRole(actualRole) {
  if (
    ![
      'ROLE_ADMIN',
      'ROLE_BANK',
      'ROLE_CUSTOMER',
    ].includes(actualRole)
  ) {
    return 'Invalid user role.'
  }

  if (selectedRole !== actualRole) {
    return (
      `Selected role does not match this account. ` +
      `This account is ${actualRole.replace('ROLE_', '')}.`
    )
  }

  return ''
  }


  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    if (!selectedRole) {
      setError('Please select user role.')
      return
    }

    if (!email.trim()) {
      setError('Please enter your email.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.trim(),
            password
          })
        }
      )

      const responseText =
        await response.text()

      let data = responseText

      try {
        data = JSON.parse(responseText)
      } catch {
        // Backend returned plain text.
      }

      if (!response.ok) {
        const message =
          typeof data === 'string'
            ? data ||
              `Login failed (${response.status})`
            : data?.message ||
              data?.error ||
              `Login failed (${response.status})`

        throw new Error(message)
      }

      const token =
        typeof data === 'string'
          ? data.replace(/^"|"$/g, '')
          : data?.token ||
            data?.jwt ||
            data?.accessToken

      if (!token) {
        throw new Error(
          'Login response received, but JWT token was not found.'
        )
      }

      const backendRole =
        typeof data === 'object'
          ? data?.role ||
            data?.userRole ||
            data?.authority
          : ''

      const actualRole =
        normalizeRole(
          backendRole ||
          getRoleFromJwt(token)
        )

      if (!actualRole) {
        throw new Error(
          'User role could not be determined from the login response.'
        )
      }

      if (selectedRole !== actualRole) {
        throw new Error(
          `Selected role does not match this account. This account is ${actualRole.replace('ROLE_', '')}.`
        )
      }

      const roleError =
        validateRole(actualRole)

      if (roleError) {
        throw new Error(roleError)
      }

      const name =
        typeof data === 'object'
          ? data?.name || ''
          : ''

      sessionStorage.setItem(
        'jwtToken',
        token
      )

      sessionStorage.setItem(
        'userRole',
        actualRole
      )

      if (name) {
        sessionStorage.setItem(
          'userName',
          name
        )
      } else {
        sessionStorage.removeItem(
          'userName'
        )
      }

      if (onLoginSuccess) {
        onLoginSuccess(actualRole)
      }
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to Spring Boot backend. Check port 8080.'
          : err.message ||
            'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function clearForm() {
    setSelectedRole(initialRole)
    setEmail('')
    setPassword('')
    setError('')
  }

  const pageTitle =
    isAdminLogin
      ? 'Admin Login'
      : isBankLogin
        ? 'Bank Login'
        : 'User Login'

  return (
    <div className="login-page">

      <header className="login-header">

        <div className="login-logo">
          <span className="login-logo-icon">
            🏦
          </span>

          <strong>
            Online Banking
          </strong>
        </div>

        <nav className="login-nav">
          <a href="/">About Us</a>
          <a href="/login">Accounts</a>
          <a href="/login">Loans</a>
          <a href="/login">Cards</a>
          <a href="/login">Personal</a>
          <a href="/login">Business</a>
          <a href="/login">Corporate</a>
          <a href="/login">Customer Service</a>
          <a href="/login">Contact Us</a>
        </nav>

        <div className="login-header-links">
          <a href="/admin/login">
            Admin
          </a>

          <a href="/login">
            Login
          </a>
        </div>

      </header>

      <main className="login-main">

        <div className="login-card">

          <div className="login-card-title">
            {pageTitle}
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="login-field">

              <label htmlFor="user-role">
                User Role
              </label>

              <select
                id="user-role"
                value={selectedRole}
                onChange={(event) =>
                  setSelectedRole(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Select Role
                </option>

                <option value="ROLE_ADMIN">
                  Admin
                </option>

                <option value="ROLE_CUSTOMER">
                  Customer
                </option>

                <option value="ROLE_BANK">
                  Bank
                </option>

              </select>

            </div>

            <div className="login-field">

              <label htmlFor="login-email">
                Email
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />

            </div>

            <div className="login-field">

              <label htmlFor="login-password">
                Password
              </label>

              <div className="login-password-box">

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Enter Password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                >
                  {showPassword
                    ? 'Hide'
                    : 'Show'}
                </button>

              </div>

            </div>

            <div className="login-buttons">

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Login...'
                  : 'Login'}
              </button>

              <button
                type="button"
                onClick={clearForm}
              >
                Clear
              </button>

            </div>

          </form>

          <div className="login-register-link">
            <a href="/register">
              New Customer Registration
            </a>
          </div>

          <div className="login-register-link">
            <a href="/admin/login">
              Admin Login
            </a>

            <span> | </span>

            <a href="/bank/login">
              Bank Login
            </a>
          </div>

          <div className="login-security">

            <strong>
              Security Notice
            </strong>

            <p>
              Never share your password, OTP,
              PIN or other confidential banking
              information.
            </p>

          </div>

        </div>

      </main>

      <footer className="login-footer">

        <div className="login-footer-column">

          <h3>
            ONLINE BANKING
          </h3>

          <p>
            Seamlessly manage your financial
            journey with ease — initiate secure
            transactions, deposit funds
            effortlessly, and access your money
            whenever you need.
          </p>

        </div>

        <div className="login-footer-column">

          <h3>
            ABOUT US
          </h3>

          <p>
            Account
          </p>

          <p>
            Loan
          </p>

        </div>

        <div className="login-footer-column">

          <h3>
            SERVICES
          </h3>

          <p>
            Accounts
          </p>

          <p>
            Loans
          </p>

          <p>
            Cards
          </p>

        </div>

        <div className="login-footer-column">

          <h3>
            CONTACT
          </h3>

          <p>
            support@onlinebanking.com
          </p>

          <p>
            1800-123-4567
          </p>

        </div>

      </footer>

    </div>
  )
}

export default Login
