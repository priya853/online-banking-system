import { useEffect, useState } from 'react'
import AdminPageLayout from './AdminPageLayout'
import './CreateBankAccount.css'

function CreateBankAccount({ onLogout }) {
  const [customers, setCustomers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = sessionStorage.getItem('jwtToken')

  async function fetchCustomers() {
    setLoadingCustomers(true)
    setError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/admin/users',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(
          `Failed to load customers (${response.status})`
        )
      }

      const data = await response.json()

      const customerList = Array.isArray(data)
        ? data.filter(
            (user) =>
              String(user.role || '').toUpperCase() === 'ROLE_CUSTOMER' ||
              String(user.role || '').toUpperCase() === 'ROLE_USER'
          )
        : []

      setCustomers(customerList)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingCustomers(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!selectedUserId) {
      setError('Please select a customer.')
      return
    }

    setCreating(true)

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/accounts/user/${selectedUserId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const responseText = await response.text()

      let data = responseText

      try {
        data = JSON.parse(responseText)
      } catch {
        // Backend may return plain text.
      }

      if (!response.ok) {
        const message =
          typeof data === 'string'
            ? data || `Account creation failed (${response.status})`
            : data.message ||
              data.error ||
              `Account creation failed (${response.status})`

        throw new Error(message)
      }

      const accountNumber =
        typeof data === 'object' &&
        data?.accountNumber
          ? data.accountNumber
          : null

      if (accountNumber) {
        setSuccess(
          `Bank account created successfully. Account Number: ${accountNumber}`
        )
      } else {
        setSuccess('Bank account created successfully.')
      }

      setSelectedUserId('')
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  function handleClear() {
    setSelectedUserId('')
    setError('')
    setSuccess('')
  }

  const selectedCustomer = customers.find(
    (customer) =>
      String(customer.id) === String(selectedUserId)
  )

  return (
    <AdminPageLayout
      title="Create Bank Account"
      subtitle="Create a new bank account for a registered customer."
      onLogout={onLogout}
    >
      <div className="create-account-content">

        <div className="create-account-header">
          <div>
            <span className="create-account-eyebrow">
              ACCOUNT MANAGEMENT
            </span>

            <h2>Bank Account Creation</h2>

            <p>
              Select a registered customer and create a new bank account.
            </p>
          </div>

          <div className="create-account-badge">
            Admin Access
          </div>
        </div>

        <div className="create-account-card">

          <div className="create-account-card-heading">
            <span>NEW ACCOUNT</span>
            <h3>Create Bank Account</h3>
            <p>
              Choose the customer who will own this bank account.
            </p>
          </div>

          {success && (
            <div className="create-account-message create-account-success">
              <strong>Account Created</strong>
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="create-account-message create-account-error">
              <strong>Unable to Create Account</strong>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="create-account-field">
              <label htmlFor="customer">
                Select Customer
              </label>

              <select
                id="customer"
                value={selectedUserId}
                onChange={(event) =>
                  setSelectedUserId(event.target.value)
                }
                disabled={loadingCustomers || creating}
              >
                <option value="">
                  {loadingCustomers
                    ? 'Loading customers...'
                    : 'Select customer'}
                </option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name} - {customer.email} (ID: {customer.id})
                  </option>
                ))}
              </select>

              <span className="create-account-hint">
                Only registered customers are available for account creation.
              </span>
            </div>

            {selectedCustomer && (
              <div className="create-account-selected">

                <div className="create-account-selected-header">
                  <div>
                    <span>SELECTED CUSTOMER</span>
                    <h3>{selectedCustomer.name}</h3>
                  </div>

                  <div className="create-account-customer-id">
                    ID {selectedCustomer.id}
                  </div>
                </div>

                <div className="create-account-customer-grid">

                  <div>
                    <span>Email</span>
                    <strong>{selectedCustomer.email || '-'}</strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>{selectedCustomer.phone || '-'}</strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong>{selectedCustomer.status || '-'}</strong>
                  </div>

                </div>
              </div>
            )}

            <div className="create-account-actions">

              <button
                type="submit"
                className="create-account-primary"
                disabled={
                  creating ||
                  loadingCustomers ||
                  !selectedUserId
                }
              >
                {creating
                  ? 'Creating Account...'
                  : 'Create Bank Account'}
              </button>

              <button
                type="button"
                className="create-account-secondary"
                onClick={handleClear}
                disabled={creating}
              >
                Clear
              </button>

            </div>

          </form>

          <div className="create-account-security">
            <strong>Account Creation</strong>
            <p>
              A unique bank account number will be generated after successful
              creation.
            </p>
          </div>

        </div>
      </div>
    </AdminPageLayout>
  )
}

export default CreateBankAccount