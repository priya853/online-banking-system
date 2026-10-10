import { useEffect, useState } from 'react'
import BankPageLayout from './BankPageLayout'
import './BankCustomers.css'

function BankCustomers({ onLogout }) {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadCustomers() {
    try {
      setLoading(true)
      setError('')

      const token = sessionStorage.getItem('jwtToken')

      if (!token) {
        throw new Error('Session expired. Please login again.')
      }

      const response = await fetch(
        'http://localhost:8080/api/bank/customers',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const text = await response.text()

      if (!response.ok) {
        throw new Error(
          text || `Failed to load customers (${response.status})`
        )
      }

      const data = text ? JSON.parse(text) : []

      setCustomers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load customers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const filteredCustomers = customers.filter((customer) => {
    const value = search.trim().toLowerCase()

    if (!value) {
      return true
    }

    return (
      String(customer.id || '').toLowerCase().includes(value) ||
      String(customer.name || '').toLowerCase().includes(value) ||
      String(customer.email || '').toLowerCase().includes(value) ||
      String(customer.phone || '').toLowerCase().includes(value) ||
      String(customer.status || '').toLowerCase().includes(value)
    )
  })

  function handleViewDetails(customer) {
    setSelectedCustomer(customer)
  }

  function closeDetails() {
    setSelectedCustomer(null)
  }

  return (
    <BankPageLayout
      title="Bank Customers"
      subtitle="View registered customer information."
      onLogout={onLogout}
    >
      <div className="bank-customers-content">

        <div className="bank-customers-header">
          <div>
            <span className="bank-customers-eyebrow">CUSTOMER MANAGEMENT</span>
            <h2>Customer List</h2>
            <p>
              Search and view registered customers and their account details.
            </p>
          </div>

          <div className="bank-customers-count">
            <span>Total Customers</span>
            <strong>{filteredCustomers.length}</strong>
          </div>
        </div>

        <div className="bank-customers-toolbar">
          <div className="bank-customers-search">
            <span className="bank-customers-search-icon" aria-hidden="true"></span>
            <input
              type="text"
              placeholder="Search by ID, name, email, phone or status..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                className="bank-customers-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >

              </button>
            )}
          </div>
        </div>

        {selectedCustomer && (
          <div className="bank-customers-details">
            <div className="bank-customers-details-header">
              <div>
                <span className="bank-customers-eyebrow">CUSTOMER PROFILE</span>
                <h2>Customer Details</h2>
              </div>

              <button
                type="button"
                className="bank-customers-close"
                onClick={closeDetails}
              >
                Close
              </button>
            </div>

            <div className="bank-customers-detail-grid">
              <div className="bank-customers-detail-card">
                <span>Customer ID</span>
                <strong>{selectedCustomer.id}</strong>
              </div>

              <div className="bank-customers-detail-card">
                <span>Name</span>
                <strong>{selectedCustomer.name || '-'}</strong>
              </div>

              <div className="bank-customers-detail-card">
                <span>Email</span>
                <strong>{selectedCustomer.email || '-'}</strong>
              </div>

              <div className="bank-customers-detail-card">
                <span>Phone</span>
                <strong>{selectedCustomer.phone || '-'}</strong>
              </div>

              <div className="bank-customers-detail-card">
                <span>Status</span>
                <strong className="bank-customers-status-value">
                  {selectedCustomer.status || '-'}
                </strong>
              </div>

              <div className="bank-customers-detail-card">
                <span>Role</span>
                <strong>{selectedCustomer.role || '-'}</strong>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="bank-customers-state">
            <div className="bank-customers-spinner"></div>
            <span>Loading customers...</span>
          </div>
        )}

        {error && (
          <div className="bank-customers-error">
            <strong>Unable to load customers</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="bank-customers-table-panel">
            <div className="bank-customers-table-header">
              <div>
                <h3>Registered Customers</h3>
                <span>
                  Showing {filteredCustomers.length} customer
                  {filteredCustomers.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="bank-customers-table-wrap">
              <table className="bank-customers-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="bank-customers-empty">
                        <div>
                          <strong>No customers found</strong>
                          <span>Try another search term.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td>
                          <span className="bank-customers-id">{customer.id}</span>
                        </td>

                        <td>
                          <div className="bank-customers-name-cell">
                            <div className="bank-customers-avatar">
                              {(customer.name || 'C')
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <strong>{customer.name || '-'}</strong>
                              <span>Customer</span>
                            </div>
                          </div>
                        </td>

                        <td>{customer.email || '-'}</td>

                        <td>{customer.phone || '-'}</td>

                        <td>
                          <span
                            className={`bank-customers-status ${
                              String(customer.status || '')
                                .toLowerCase() === 'blocked'
                                ? 'blocked'
                                : 'active'
                            }`}
                          >
                            {customer.status || '-'}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="bank-customers-view"
                            onClick={() =>
                              handleViewDetails(customer)
                            }
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </BankPageLayout>
  )
}

export default BankCustomers
