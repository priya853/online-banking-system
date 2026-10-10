import { useEffect, useState } from 'react'
import BankPageLayout from './pages/BankPageLayout'
import './BankDashboard.css'

function BankDashboard({ onLogout }) {
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalBalance: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = sessionStorage.getItem('jwtToken')
  const bankName = sessionStorage.getItem('userName') || 'Bank User'

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          'http://localhost:8080/api/bank/dashboard',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const text = await response.text()

        if (!response.ok) {
          throw new Error(
            text || `Failed to load dashboard (${response.status})`
          )
        }

        setSummary(JSON.parse(text))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [token])

  const money = Number(summary.totalBalance || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <BankPageLayout
      title="Bank Dashboard"
      subtitle={`Welcome, ${bankName}. Monitor overall banking activity.`}
      onLogout={onLogout}
    >
      <div className="bank-dashboard-content">
        {error && <div className="bank-dashboard-error">{error}</div>}

        <div className="bank-dashboard-welcome">
          <div>
            <span className="bank-dashboard-eyebrow">BANK OPERATIONS</span>
            <h2>Banking Overview</h2>
            <p>
              Monitor customers, accounts, transactions and managed balance
              from one place.
            </p>
          </div>

          <div className="bank-dashboard-status">
            <span className="bank-status-dot"></span>
            System Active
          </div>
        </div>

        <div className="bank-dashboard-stats">
          <div className="bank-dashboard-card">
            <div className="bank-dashboard-card-top">
              <span className="bank-dashboard-icon">👥</span>
              <span className="bank-dashboard-label">CUSTOMERS</span>
            </div>
            <h3>
              {loading ? '...' : summary.totalCustomers.toLocaleString('en-IN')}
            </h3>
            <p>Registered customers</p>
          </div>

          <div className="bank-dashboard-card">
            <div className="bank-dashboard-card-top">
              <span className="bank-dashboard-icon">🏦</span>
              <span className="bank-dashboard-label">ACCOUNTS</span>
            </div>
            <h3>
              {loading ? '...' : summary.totalAccounts.toLocaleString('en-IN')}
            </h3>
            <p>Managed bank accounts</p>
          </div>

          <div className="bank-dashboard-card">
            <div className="bank-dashboard-card-top">
              <span className="bank-dashboard-icon">↔</span>
              <span className="bank-dashboard-label">TRANSACTIONS</span>
            </div>
            <h3>
              {loading
                ? '...'
                : summary.totalTransactions.toLocaleString('en-IN')}
            </h3>
            <p>Total banking transactions</p>
          </div>
        </div>

        <div className="bank-dashboard-balance-panel">
          <div className="bank-balance-content">
            <div>
              <span className="bank-dashboard-eyebrow">TOTAL MANAGED BALANCE</span>
              <h2>&#8377;{loading ? '...' : money}</h2>
              <p>
                Combined balance across all registered bank accounts.
              </p>
            </div>

            <div className="bank-balance-badge">
              <span>✓</span>
              Active Accounts
            </div>
          </div>
        </div>

        <div className="bank-dashboard-footer-note">
          <strong>Bank Management</strong>
          <span>
            Use the navigation menu to manage customers, accounts and
            transactions.
          </span>
        </div>
      </div>
    </BankPageLayout>
  )
}

export default BankDashboard
