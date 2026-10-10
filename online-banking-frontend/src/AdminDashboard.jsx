import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminPageLayout from './admin/AdminPageLayout'
import './pages/LegacyBank.css'
import './AdminDashboard.css'

function AdminDashboard({ onLogout }) {
  const [users, setUsers] = useState([])
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = sessionStorage.getItem('jwtToken')

  async function fetchAdminData() {
    setLoading(true)
    setError('')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const [
        usersResponse,
        accountsResponse,
        transactionsResponse,
      ] = await Promise.all([
        fetch('http://localhost:8080/api/admin/users', {
          headers,
        }),
        fetch('http://localhost:8080/api/admin/accounts', {
          headers,
        }),
        fetch(
          'http://localhost:8080/api/admin/transactions',
          {
            headers,
          }
        ),
      ])

      if (
        !usersResponse.ok ||
        !accountsResponse.ok ||
        !transactionsResponse.ok
      ) {
        throw new Error(
          'Failed to load admin dashboard data.'
        )
      }

      const usersData =
        await usersResponse.json()

      const accountsData =
        await accountsResponse.json()

      const transactionsData =
        await transactionsResponse.json()

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      )

      setAccounts(
        Array.isArray(accountsData)
          ? accountsData
          : []
      )

      setTransactions(
        Array.isArray(transactionsData)
          ? transactionsData
          : []
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  async function updateUserStatus(id, status) {
    try {
      const endpoint =
        status === 'ACTIVE'
          ? `http://localhost:8080/api/admin/users/${id}/activate`
          : `http://localhost:8080/api/admin/users/${id}/block`

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(
          `Failed to update user (${response.status})`
        )
      }

      await fetchAdminData()
    } catch (err) {
      alert(err.message)
    }
  }

  function formatAmount(amount) {
    return Number(amount || 0).toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )
  }

  const customers = users.filter((user) => {
    const role = String(user.role || '').toUpperCase()
    return role === 'ROLE_CUSTOMER' || role === 'ROLE_USER'
  })

  const activeUsers = customers.filter(
    (user) => String(user.status).toUpperCase() === 'ACTIVE'
  ).length

  const blockedUsers = customers.filter(
    (user) => String(user.status).toUpperCase() !== 'ACTIVE'
  ).length

  const totalBalance = accounts.reduce(
    (total, account) =>
      total + Number(account.balance || 0),
    0
  )

  return (
    <AdminPageLayout
      title="Admin Dashboard"
      subtitle="Manage the Online Banking system."
      onLogout={onLogout}
    >
      <div className="admin-dashboard-content">
        {/* Summary */}
        <div className="bank-info-grid">
          <div className="bank-info-card">
            <h3>Total Customers</h3>

            <p
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#7d1007',
              }}
            >
              {loading ? '...' : customers.length}
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Active Customers</h3>

            <p
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#176117',
              }}
            >
              {loading ? '...' : activeUsers}
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Bank Accounts</h3>

            <p
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#7d1007',
              }}
            >
              {loading
                ? '...'
                : accounts.length}
            </p>
          </div>
        </div>

        {/* Banking Overview */}
        <div className="bank-panel">
          <h2 className="bank-section-title">
            Banking Overview
          </h2>

          <div className="bank-info-grid">
            <div className="bank-info-card">
              <h3>Total Account Balance</h3>

              <p
                style={{
                  fontSize: '21px',
                  fontWeight: '700',
                  color: '#7d1007',
                }}
              >
                ₹
                {loading
                  ? '...'
                  : formatAmount(
                      totalBalance
                    )}
              </p>
            </div>

            <div className="bank-info-card">
              <h3>Total Transactions</h3>

              <p
                style={{
                  fontSize: '21px',
                  fontWeight: '700',
                  color: '#7d1007',
                }}
              >
                {loading
                  ? '...'
                  : transactions.length}
              </p>
            </div>

            <div className="bank-info-card">
              <h3>Blocked Customers</h3>

              <p
                style={{
                  fontSize: '21px',
                  fontWeight: '700',
                  color: '#941d14',
                }}
              >
                {loading
                  ? '...'
                  : blockedUsers}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Administration */}
        <div className="bank-panel">
          <h2 className="bank-section-title">
            Quick Administration
          </h2>

          <div className="bank-info-grid">
            <div className="bank-info-card">
              <h3>Register Manager</h3>

              <p>
                Create a new bank manager account.
              </p>

              <div className="bank-button-row">
                <Link
                  to="/admin/register-manager"
                  className="bank-button"
                >
                  Open
                </Link>
              </div>
            </div>

            <div className="bank-info-card">
              <h3>Add Bank</h3>

              <p>
                Register a bank and branch.
              </p>

              <div className="bank-button-row">
                <Link
                  to="/admin/add-bank"
                  className="bank-button"
                >
                  Open
                </Link>
              </div>
            </div>

            <div className="bank-info-card">
              <h3>Create Bank Account</h3>

              <p>
                Create a bank account for a
                registered customer.
              </p>

              <div className="bank-button-row">
                <Link
                  to="/admin/create-account"
                  className="bank-button"
                >
                  Open
                </Link>
              </div>
            </div>

            <div className="bank-info-card">
              <h3>Customers</h3>

              <p>
                View and manage customer accounts.
              </p>

              <div className="bank-button-row">
                <Link
                  to="/admin/customers"
                  className="bank-button"
                >
                  Open
                </Link>
              </div>
            </div>

            <div className="bank-info-card">
              <h3>Transactions</h3>

              <p>
                Monitor all banking transactions.
              </p>

              <div className="bank-button-row">
                <Link
                  to="/admin/transactions"
                  className="bank-button"
                >
                  Open
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Management */}
        <div className="bank-panel">
          <h2 className="bank-section-title">
            Customer Management
          </h2>

          {error && (
            <div className="bank-error">
              {error}
            </div>
          )}

          {!loading && users.length === 0 ? (
            <div className="empty-state">
              No customer records found.
            </div>
          ) : (
            <div className="bank-table-wrapper">
              <table className="bank-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {customers
                    .slice(0, 8)
                    .map((user, index) => {
                      const isActive =
                        String(
                          user.status
                        ).toUpperCase() ===
                        'ACTIVE'

                      return (
                        <tr key={user.id}>
                          <td>{index + 1}</td>

                          <td>{user.id}</td>

                          <td>{user.name}</td>

                          <td>{user.email}</td>

                          <td>{user.role}</td>

                          <td>
                            <span
                              className={`bank-status ${
                                isActive
                                  ? 'active'
                                  : 'blocked'
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="bank-button"
                              onClick={() =>
                                updateUserStatus(
                                  user.id,
                                  isActive
                                    ? 'BLOCKED'
                                    : 'ACTIVE'
                                )
                              }
                            >
                              {isActive
                                ? 'Block'
                                : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )}

          {users.length > 8 && (
            <div className="bank-button-row">
              <Link
                to="/admin/customers"
                className="bank-button"
              >
                View All Customers
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  )
}

export default AdminDashboard