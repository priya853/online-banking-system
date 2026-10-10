import { useState } from 'react'
import AdminPageLayout from './AdminPageLayout'
import './RegisterManager.css'

function RegisterManager({ onLogout }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bankName: '',
    branch: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const token = sessionStorage.getItem('jwtToken')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setMessage('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setMessage('')
    setError('')

    const hasEmptyField = Object.values(form).some(
      (value) => !value.trim()
    )

    if (hasEmptyField) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/admin/bank-users',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            phone: form.phone.trim(),
            bankName: form.bankName.trim(),
            branch: form.branch.trim(),
          }),
        }
      )

      const text = await response.text()
      let data = text

      try {
        data = JSON.parse(text)
      } catch {
        // plain text response
      }

      if (!response.ok) {
        throw new Error(
          typeof data === 'string'
            ? data || `Registration failed (${response.status})`
            : data.message ||
              data.error ||
              `Registration failed (${response.status})`
        )
      }

      setMessage('Bank Manager account created successfully.')

      setForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        bankName: '',
        branch: '',
      })
    } catch (err) {
      setError(err.message)
    }
  }

  function handleClear() {
    setForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      bankName: '',
      branch: '',
    })

    setMessage('')
    setError('')
  }

  return (
    <AdminPageLayout
      title="Register Bank Manager"
      subtitle="Create a new bank manager account."
      onLogout={onLogout}
    >
      <div className="register-manager-content">

        <div className="register-manager-header">
          <div>
            <span className="register-manager-eyebrow">
              ADMINISTRATION
            </span>

            <h2>Bank Manager Registration</h2>

            <p>
              Create a secure account for an authorized bank manager.
            </p>
          </div>

          <div className="register-manager-badge">
            Admin Access
          </div>
        </div>

        <div className="register-manager-card">

          <div className="register-manager-card-heading">
            <span>MANAGER ACCOUNT</span>
            <h3>Create Bank Manager</h3>
            <p>
              Enter the manager's personal and bank details below.
            </p>
          </div>

          {message && (
            <div className="register-manager-message register-manager-success">
              <strong>Registration Successful</strong>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="register-manager-message register-manager-error">
              <strong>Registration Failed</strong>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="register-manager-grid">

              <div className="register-manager-field">
                <label htmlFor="name">Manager Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter manager name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              <div className="register-manager-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="register-manager-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

              <div className="register-manager-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>

              <div className="register-manager-field">
                <label htmlFor="bankName">Bank Name</label>
                <input
                  id="bankName"
                  name="bankName"
                  type="text"
                  placeholder="Enter bank name"
                  value={form.bankName}
                  onChange={handleChange}
                />
              </div>

              <div className="register-manager-field">
                <label htmlFor="branch">Branch Name</label>
                <input
                  id="branch"
                  name="branch"
                  type="text"
                  placeholder="Enter branch name"
                  value={form.branch}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="register-manager-actions">
              <button
                type="submit"
                className="register-manager-primary"
              >
                Register Manager
              </button>

              <button
                type="button"
                className="register-manager-secondary"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </form>

          <div className="register-manager-security">
            <strong>Manager Account Security</strong>
            <p>
              Only authorized administrators should create or manage bank
              manager accounts.
            </p>
          </div>

        </div>
      </div>
    </AdminPageLayout>
  )
}

export default RegisterManager