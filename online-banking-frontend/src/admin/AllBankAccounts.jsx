import { useEffect, useMemo, useState } from 'react'
import AdminPageLayout from './AdminPageLayout'
import './AllBankAccounts.css'

function AllBankAccounts({ onLogout }) {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const token = sessionStorage.getItem('jwtToken')

  async function fetchAccounts() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/admin/accounts',
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
          responseText || `Failed to load accounts (${response.status})`
        )
      }

      const data = responseText ? JSON.parse(responseText) : []
      setAccounts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  function formatBalance(balance) {
    return Number(balance || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const filteredAccounts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return accounts
    }

    return accounts.filter((account) => {
      const values = [
        account.id,
        account.accountNumber,
        account.userId,
        account.customerName,
        account.customerEmail,
      ]

      return values
        .map((value) => String(value || '').toLowerCase())
        .some((value) => value.includes(query))
    })
  }, [accounts, searchTerm])

  function handleClearSearch() {
    setSearchTerm('')
  }

  return (
    <AdminPageLayout
      title="All Bank Accounts"
      subtitle="View all registered customer bank accounts."
      onLogout={onLogout}
    >
      <div className="all-bank-accounts-content">

        <div className="all-bank-accounts-header">
          <div>
            <span className="all-bank-accounts-eyebrow">
              ACCOUNT MANAGEMENT
            </span>

            <h2>Bank Account Records</h2>

            <p>
              Review customer account numbers, ownership details and balances.
            </p>
          </div>

          <div className="all-bank-accounts-count">
            <span>Filtered Accounts</span>
            <strong>{filteredAccounts.length}</strong>
          </div>
        </div>

        {!loading && !error && accounts.length > 0 && (
          <div className="all-bank-accounts-toolbar">
            <div className="all-bank-accounts-search">
              <span
                className="all-bank-accounts-search-icon"
                aria-hidden="true"
              ></span>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search account number, customer name, email or customer ID..."
                aria-label="Search bank accounts"
              />

              {searchTerm && (
                <button
                  type="button"
                  className="all-bank-accounts-clear-icon"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <button
              type="button"
              className="all-bank-accounts-clear"
              onClick={handleClearSearch}
              disabled={!searchTerm}
            >
              Clear
            </button>
          </div>
        )}

        {!loading && !error && searchTerm && accounts.length > 0 && (
          <div className="all-bank-accounts-result-info">
            Showing <strong>{filteredAccounts.length}</strong> of{' '}
            <strong>{accounts.length}</strong> accounts
          </div>
        )}

        {loading && (
          <div className="all-bank-accounts-state">
            <div className="all-bank-accounts-spinner"></div>
            <span>Loading bank accounts...</span>
          </div>
        )}

        {!loading && error && (
          <div className="all-bank-accounts-error">
            <strong>Unable to load bank accounts</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && accounts.length === 0 && (
          <div className="all-bank-accounts-state">
            <strong>No bank accounts found.</strong>
          </div>
        )}

        {!loading &&
          !error &&
          accounts.length > 0 &&
          filteredAccounts.length === 0 && (
            <div className="all-bank-accounts-state">
              <strong>No matching bank account found.</strong>
              <span>Try a different search term.</span>
            </div>
          )}

        {!loading && !error && filteredAccounts.length > 0 && (
          <div className="all-bank-accounts-table-panel">
            <div className="all-bank-accounts-table-header">
              <div>
                <h3>Registered Account Directory</h3>
                <span>
                  Showing {filteredAccounts.length} account
                  {filteredAccounts.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="all-bank-accounts-table-wrap">
              <table className="all-bank-accounts-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Account ID</th>
                    <th>Account Number</th>
                    <th>Customer ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Balance</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAccounts.map((account, index) => (
                    <tr key={account.id}>
                      <td>
                        <span className="all-bank-accounts-index">
                          {index + 1}
                        </span>
                      </td>

                      <td>
                        <span className="all-bank-accounts-id">
                          {account.id}
                        </span>
                      </td>

                      <td>
                        <span className="all-bank-accounts-number">
                          {account.accountNumber || '-'}
                        </span>
                      </td>

                      <td>{account.userId ?? '-'}</td>

                      <td>
                        <div className="all-bank-accounts-customer">
                          <div className="all-bank-accounts-avatar">
                            {(account.customerName || 'C')
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <strong>{account.customerName || 'N/A'}</strong>
                        </div>
                      </td>

                      <td>{account.customerEmail || 'N/A'}</td>

                      <td>
                        <span className="all-bank-accounts-balance">
                          &#8377;{formatBalance(account.balance)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminPageLayout>
  )
}

export default AllBankAccounts