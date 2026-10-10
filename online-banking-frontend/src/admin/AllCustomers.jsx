import { useEffect, useMemo, useState } from 'react'
import AdminPageLayout from './AdminPageLayout'
import './AllCustomers.css'

function AllCustomers({ onLogout }) {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const token = sessionStorage.getItem('jwtToken')

  async function fetchCustomers() {
    setLoading(true)
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

      const responseText = await response.text()

      if (!response.ok) {
        throw new Error(
          responseText ||
            `Failed to load customers (${response.status})`
        )
      }

      const data = JSON.parse(responseText)

      const customerList = Array.isArray(data)
        ? data.filter((user) => {
            const role = String(user.role || '').toUpperCase()

            return (
              role === 'ROLE_CUSTOMER' ||
              role === 'ROLE_USER'
            )
          })
        : []

      setCustomers(customerList)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function updateCustomerStatus(customerId, action) {
    setUpdatingId(customerId)
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${customerId}/${action}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const responseText = await response.text()

      if (!response.ok) {
        throw new Error(
          responseText ||
            `Failed to update customer (${response.status})`
        )
      }

      await fetchCustomers()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  async function deleteCustomer(customerId, customerName) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${customerName || 'this customer'}?\n\nThis will also delete the customer's bank accounts and transactions.`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(customerId)
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${customerId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const responseText = await response.text()

      if (!response.ok) {
        throw new Error(
          responseText ||
            `Failed to delete customer (${response.status})`
        )
      }

      await fetchCustomers()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredCustomers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return customers
    }

    return customers.filter((customer) => {
      const values = [
        customer.id,
        customer.name,
        customer.email,
        customer.status,
        customer.role,
        customer.phone,
      ]

      return values
        .map((value) => String(value || '').toLowerCase())
        .some((value) => value.includes(query))
    })
  }, [customers, searchTerm])

  function handleClearSearch() {
    setSearchTerm('')
  }

  return (
    <AdminPageLayout
      title="All Customers"
      subtitle="View and manage registered customers."
      onLogout={onLogout}
    >
      <div className="all-customers-content">

        <div className="all-customers-header">
          <div>
            <span className="all-customers-eyebrow">
              CUSTOMER MANAGEMENT
            </span>

            <h2>Customer Records</h2>

            <p>
              Search, activate, block or permanently delete registered
              customers.
            </p>
          </div>

          <div className="all-customers-count">
            <span>Total Customers</span>
            <strong>{filteredCustomers.length}</strong>
          </div>
        </div>

        {!loading && !error && customers.length > 0 && (
          <div className="all-customers-toolbar">

            <div className="all-customers-search">
              <span
                className="all-customers-search-icon"
                aria-hidden="true"
              ></span>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search ID, name, email, phone, status or role..."
              />

              {searchTerm && (
                <button
                  type="button"
                  className="all-customers-clear-icon"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <button
              type="button"
              className="all-customers-clear"
              onClick={handleClearSearch}
              disabled={!searchTerm}
            >
              Clear
            </button>

          </div>
        )}

        {!loading &&
          !error &&
          customers.length > 0 &&
          searchTerm && (
            <div className="all-customers-result-info">
              Showing <strong>{filteredCustomers.length}</strong> of{' '}
              <strong>{customers.length}</strong> customers
            </div>
          )}

        {loading && (
          <div className="all-customers-state">
            <div className="all-customers-spinner"></div>
            <span>Loading customers...</span>
          </div>
        )}

        {!loading && error && (
          <div className="all-customers-error">
            <strong>Unable to load customers</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading &&
          !error &&
          customers.length === 0 && (
            <div className="all-customers-state">
              <strong>No customers found.</strong>
            </div>
          )}

        {!loading &&
          !error &&
          customers.length > 0 &&
          filteredCustomers.length === 0 && (
            <div className="all-customers-state">
              <strong>No matching customer found.</strong>
            </div>
          )}

        {!loading &&
          !error &&
          filteredCustomers.length > 0 && (
            <div className="all-customers-table-panel">

              <div className="all-customers-table-header">
                <div>
                  <h3>Registered Customer Directory</h3>
                  <span>
                    {filteredCustomers.length} customer
                    {filteredCustomers.length === 1 ? '' : 's'} displayed
                  </span>
                </div>
              </div>

              <div className="all-customers-table-wrap">
                <table className="all-customers-table">

                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Customer ID</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCustomers.map(
                      (customer, index) => {

                        const isBlocked =
                          String(customer.status || '')
                            .toUpperCase() === 'BLOCKED'

                        const busy =
                          updatingId === customer.id ||
                          deletingId === customer.id

                        return (
                          <tr key={customer.id}>

                            <td>
                              <span className="all-customers-index">
                                {index + 1}
                              </span>
                            </td>

                            <td>
                              <span className="all-customers-id">
                                {customer.id}
                              </span>
                            </td>

                            <td>
                              <div className="all-customers-name-cell">

                                <div className="all-customers-avatar">
                                  {(customer.name || 'C')
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <strong>
                                    {customer.name || '-'}
                                  </strong>

                                  <span>
                                    Customer
                                  </span>
                                </div>

                              </div>
                            </td>

                            <td>
                              {customer.email || '-'}
                            </td>

                            <td>
                              {customer.phone || '-'}
                            </td>

                            <td>
                              <span className="all-customers-role">
                                {customer.role || '-'}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`all-customers-status ${
                                  isBlocked
                                    ? 'blocked'
                                    : 'active'
                                }`}
                              >
                                {customer.status || '-'}
                              </span>
                            </td>

                            <td>
                              <div className="all-customers-actions">

                                <button
                                  type="button"
                                  className={`all-customers-action ${
                                    isBlocked
                                      ? 'activate'
                                      : 'block'
                                  }`}
                                  onClick={() =>
                                    updateCustomerStatus(
                                      customer.id,
                                      isBlocked
                                        ? 'activate'
                                        : 'block'
                                    )
                                  }
                                  disabled={busy}
                                >
                                  {updatingId === customer.id
                                    ? 'Updating...'
                                    : isBlocked
                                      ? 'Activate'
                                      : 'Block'}
                                </button>

                                <button
                                  type="button"
                                  className="all-customers-action delete"
                                  onClick={() =>
                                    deleteCustomer(
                                      customer.id,
                                      customer.name
                                    )
                                  }
                                  disabled={busy}
                                >
                                  {deletingId === customer.id
                                    ? 'Deleting...'
                                    : 'Delete'}
                                </button>

                              </div>
                            </td>

                          </tr>
                        )
                      }
                    )}
                  </tbody>

                </table>
              </div>
            </div>
          )}
      </div>
    </AdminPageLayout>
  )
}

export default AllCustomers