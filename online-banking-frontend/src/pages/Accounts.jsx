import { useEffect, useState } from 'react'
import PageLayout from './PageLayout'

function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = sessionStorage.getItem('jwtToken')

  async function fetchAccounts() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/accounts/my-accounts',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to load accounts (${response.status})`)
      }

      const data = await response.json()
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

  function maskAccountNumber(accountNumber) {
    const value = String(accountNumber || '')

    if (value.length <= 4) {
      return value
    }

    return `XXXX XXXX ${value.slice(-4)}`
  }

  const totalBalance = accounts.reduce(
    (total, account) => total + Number(account.balance || 0),
    0
  )

  return (
    <PageLayout
      title="My Accounts"
      subtitle="View your bank accounts and current balances."
    >
      <div style={{ display: 'grid', gap: '20px' }}>
        <div className="bank-info-grid">
          <div className="bank-info-card">
            <h3>Total Accounts</h3>
            <p
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#7d1007',
              }}
            >
              {loading ? '...' : accounts.length}
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Total Balance</h3>
            <p
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#7d1007',
              }}
            >
              ₹{loading ? '...' : formatBalance(totalBalance)}
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Account Status</h3>
            <p
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#176117',
              }}
            >
              Active
            </p>
          </div>
        </div>

        <div className="bank-panel">
          <h2 className="bank-section-title">Account Details</h2>

          {loading && (
            <div className="empty-state">Loading your accounts...</div>
          )}

          {!loading && error && (
            <div className="bank-error">{error}</div>
          )}

          {!loading && !error && accounts.length === 0 && (
            <div className="empty-state">No bank accounts found.</div>
          )}

          {!loading && !error && accounts.length > 0 && (
            <div className="bank-table-wrapper">
              <table className="bank-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Account ID</th>
                    <th>Account Number</th>
                    <th>Balance</th>
                    <th>User ID</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {accounts.map((account, index) => (
                    <tr key={account.id}>
                      <td>{index + 1}</td>
                      <td>{account.id}</td>
                      <td style={{ fontWeight: '700' }}>
                        {maskAccountNumber(account.accountNumber)}
                      </td>
                      <td style={{ fontWeight: '700' }}>
                        ₹{formatBalance(account.balance)}
                      </td>
                      <td>{account.userId}</td>
                      <td>
                        <span className="bank-status active">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default Accounts