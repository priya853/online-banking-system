import { useEffect, useState } from 'react'
import BankPageLayout from './BankPageLayout'
import './BankAccounts.css'

function BankAccounts({ onLogout }) {
  const [accounts, setAccounts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadAccounts() {
    try {
      setLoading(true)
      setError('')

      const token = sessionStorage.getItem('jwtToken')

      if (!token) {
        throw new Error('Session expired. Please login again.')
      }

      const response = await fetch(
        'http://localhost:8080/api/bank/accounts',
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
          text || `Failed to load accounts (${response.status})`
        )
      }

      const data = text ? JSON.parse(text) : []

      setAccounts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load accounts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const filteredAccounts = accounts.filter((account) => {
    const value = search.trim().toLowerCase()

    if (!value) {
      return true
    }

    return (
      String(account.id || '').toLowerCase().includes(value) ||
      String(account.accountNumber || '').toLowerCase().includes(value) ||
      String(account.customerName || '').toLowerCase().includes(value) ||
      String(account.customerEmail || '').toLowerCase().includes(value)
    )
  })

  function formatMoney(value) {
    return Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <BankPageLayout
      title="Bank Accounts"
      subtitle="View all registered customer bank accounts."
      onLogout={onLogout}
    >
      <div className="bank-accounts-content">

        <div className="bank-accounts-header">
          <div>
            <span className="bank-accounts-eyebrow">
              ACCOUNT MANAGEMENT
            </span>

            <h2>Account List</h2>

            <p>
              Monitor customer accounts and their current balances.
            </p>
          </div>

          <div className="bank-accounts-count">
            <span>Total Accounts</span>
            <strong>{filteredAccounts.length}</strong>
          </div>
        </div>

        <div className="bank-accounts-toolbar">
          <div className="bank-accounts-search">
            <span
              className="bank-accounts-search-icon"
              aria-hidden="true"
            ></span>

            <input
              type="text"
              placeholder="Search by ID, account number, customer or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                type="button"
                className="bank-accounts-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="bank-accounts-state">
            <div className="bank-accounts-spinner"></div>
            <span>Loading accounts...</span>
          </div>
        )}

        {error && (
          <div className="bank-accounts-error">
            <strong>Unable to load accounts</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="bank-accounts-table-panel">
            <div className="bank-accounts-table-header">
              <div>
                <h3>Registered Bank Accounts</h3>
                <span>
                  Showing {filteredAccounts.length} account
                  {filteredAccounts.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="bank-accounts-table-wrap">
              <table className="bank-accounts-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Account Number</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Balance</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="bank-accounts-empty">
                        <div>
                          <strong>No accounts found</strong>
                          <span>Try another search term.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((account) => (
                      <tr key={account.id}>
                        <td>
                          <span className="bank-accounts-id">
                            {account.id}
                          </span>
                        </td>

                        <td>
                          <span className="bank-account-number">
                            {account.accountNumber || '-'}
                          </span>
                        </td>

                        <td>
                          <div className="bank-accounts-name-cell">
                            <div className="bank-accounts-avatar">
                              {(account.customerName || 'C')
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {account.customerName || '-'}
                              </strong>
                              <span>Customer</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {account.customerEmail || '-'}
                        </td>

                        <td>
                          <span className="bank-account-balance">
                            &#8377;{formatMoney(account.balance)}
                          </span>
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

export default BankAccounts