import { useEffect, useMemo, useState } from 'react'
import BankPageLayout from './BankPageLayout'
import './BankTransactions.css'

function BankTransactions({ onLogout }) {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [transactionType, setTransactionType] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadTransactions() {
    try {
      setLoading(true)
      setError('')

      const token = sessionStorage.getItem('jwtToken')

      if (!token) {
        throw new Error('Session expired. Please login again.')
      }

      const response = await fetch(
        'http://localhost:8080/api/bank/transactions',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const text = await response.text()

      if (!response.ok) {
        throw new Error(
          text || `Failed to load transactions (${response.status})`
        )
      }

      const data = text ? JSON.parse(text) : []
      setTransactions(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load transactions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const transactionTypes = useMemo(
    () =>
      [...new Set(
        transactions
          .map((item) => String(item.type || '').trim())
          .filter(Boolean)
      )].sort(),
    [transactions]
  )

  const filteredTransactions = useMemo(() => {
    const searchValue = search.trim().toLowerCase()
    const accountValue = accountNumber.trim().toLowerCase()

    return transactions.filter((transaction) => {
      const matchesSearch =
        !searchValue ||
        String(transaction.id || '').toLowerCase().includes(searchValue) ||
        String(transaction.accountNumber || '').toLowerCase().includes(searchValue) ||
        String(transaction.type || '').toLowerCase().includes(searchValue) ||
        String(transaction.amount || '').toLowerCase().includes(searchValue)

      const matchesAccount =
        !accountValue ||
        String(transaction.accountNumber || '')
          .toLowerCase()
          .includes(accountValue)

      const matchesType =
        !transactionType ||
        String(transaction.type || '').toUpperCase() ===
          transactionType.toUpperCase()

      let matchesDate = true

      const value = transaction.transactionDate
        ? new Date(transaction.transactionDate)
        : null

      if (fromDate && value) {
        matchesDate =
          matchesDate &&
          value >= new Date(`${fromDate}T00:00:00`)
      }

      if (toDate && value) {
        matchesDate =
          matchesDate &&
          value <= new Date(`${toDate}T23:59:59.999`)
      }

      return (
        matchesSearch &&
        matchesAccount &&
        matchesType &&
        matchesDate
      )
    })
  }, [
    transactions,
    search,
    accountNumber,
    transactionType,
    fromDate,
    toDate,
  ])

  function clearFilters() {
    setSearch('')
    setAccountNumber('')
    setTransactionType('')
    setFromDate('')
    setToDate('')
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  function formatDate(value) {
    if (!value) return '-'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return String(value)
    }

    return date.toLocaleString('en-IN')
  }

  return (
    <BankPageLayout
      title="Bank Transactions"
      subtitle="View and filter transactions across registered bank accounts."
      onLogout={onLogout}
    >
      <div className="bank-transactions-content">

        <div className="bank-transactions-header">
          <div>
            <span className="bank-transactions-eyebrow">
              TRANSACTION MANAGEMENT
            </span>

            <h2>Transaction List</h2>

            <p>
              Monitor deposits, withdrawals and other banking activity.
            </p>
          </div>

          <div className="bank-transactions-count">
            <span>Filtered Results</span>
            <strong>{filteredTransactions.length}</strong>
          </div>
        </div>

        <div className="bank-transactions-filter-panel">
          <div className="bank-transactions-filter-header">
            <div>
              <span className="bank-transactions-filter-eyebrow">
                SEARCH & FILTER
              </span>
              <h3>Transaction Filters</h3>
            </div>

            <button
              type="button"
              className="bank-transactions-clear"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

          <div className="bank-transactions-filters">

            <div className="bank-transactions-field bank-transactions-search-field">
              <label>Search</label>

              <div className="bank-transactions-search">
                <span
                  className="bank-transactions-search-icon"
                  aria-hidden="true"
                ></span>

                <input
                  type="text"
                  placeholder="Search ID, account, type or amount..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="bank-transactions-field">
              <label>Account Number</label>

              <input
                type="text"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(event) =>
                  setAccountNumber(event.target.value)
                }
              />
            </div>

            <div className="bank-transactions-field">
              <label>Transaction Type</label>

              <select
                value={transactionType}
                onChange={(event) =>
                  setTransactionType(event.target.value)
                }
              >
                <option value="">All Types</option>

                {transactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="bank-transactions-field">
              <label>From Date</label>

              <input
                type="date"
                value={fromDate}
                onChange={(event) =>
                  setFromDate(event.target.value)
                }
              />
            </div>

            <div className="bank-transactions-field">
              <label>To Date</label>

              <input
                type="date"
                value={toDate}
                onChange={(event) =>
                  setToDate(event.target.value)
                }
              />
            </div>

          </div>
        </div>

        <div className="bank-transactions-summary">
          <span>
            Showing <strong>{filteredTransactions.length}</strong> of{' '}
            <strong>{transactions.length}</strong> transactions
          </span>
        </div>

        {loading && (
          <div className="bank-transactions-state">
            <div className="bank-transactions-spinner"></div>
            <span>Loading transactions...</span>
          </div>
        )}

        {error && (
          <div className="bank-transactions-error">
            <strong>Unable to load transactions</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="bank-transactions-table-panel">
            <div className="bank-transactions-table-header">
              <div>
                <h3>Bank Transaction Records</h3>
                <span>
                  Complete transaction activity across registered accounts
                </span>
              </div>
            </div>

            <div className="bank-transactions-table-wrap">
              <table className="bank-transactions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Account Number</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Balance After</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="bank-transactions-empty">
                        <div>
                          <strong>No transactions found</strong>
                          <span>
                            Try changing your search or filter values.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          <span className="bank-transaction-id">
                            {transaction.id}
                          </span>
                        </td>

                        <td>
                          <span className="bank-transaction-account">
                            {transaction.accountNumber || '-'}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`bank-transaction-type ${String(
                              transaction.type || ''
                            ).toLowerCase()}`}
                          >
                            {transaction.type || '-'}
                          </span>
                        </td>

                        <td>
                          <span className="bank-transaction-amount">
                            &#8377;{formatMoney(transaction.amount)}
                          </span>
                        </td>

                        <td>
                          <span className="bank-transaction-balance">
                            &#8377;{formatMoney(
                              transaction.balanceAfterTransaction
                            )}
                          </span>
                        </td>

                        <td>
                          <span className="bank-transaction-date">
                            {formatDate(transaction.transactionDate)}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="bank-transaction-view"
                            onClick={() =>
                              setSelectedTransaction(transaction)
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

        {selectedTransaction && (
          <div className="bank-transaction-details">

            <div className="bank-transaction-details-header">
              <div>
                <span className="bank-transactions-filter-eyebrow">
                  TRANSACTION RECORD
                </span>

                <h2>Transaction Details</h2>
              </div>

              <button
                type="button"
                className="bank-transaction-close"
                onClick={() => setSelectedTransaction(null)}
              >
                Close
              </button>
            </div>

            <div className="bank-transaction-detail-grid">

              <div className="bank-transaction-detail-card">
                <span>Transaction ID</span>
                <strong>{selectedTransaction.id}</strong>
              </div>

              <div className="bank-transaction-detail-card">
                <span>Account Number</span>
                <strong>
                  {selectedTransaction.accountNumber || '-'}
                </strong>
              </div>

              <div className="bank-transaction-detail-card">
                <span>Transaction Type</span>
                <strong>
                  {selectedTransaction.type || '-'}
                </strong>
              </div>

              <div className="bank-transaction-detail-card">
                <span>Amount</span>
                <strong>
                  &#8377;{formatMoney(selectedTransaction.amount)}
                </strong>
              </div>

              <div className="bank-transaction-detail-card">
                <span>Balance After</span>
                <strong>
                  &#8377;{formatMoney(
                    selectedTransaction.balanceAfterTransaction
                  )}
                </strong>
              </div>

              <div className="bank-transaction-detail-card">
                <span>Date</span>
                <strong>
                  {formatDate(
                    selectedTransaction.transactionDate
                  )}
                </strong>
              </div>

            </div>
          </div>
        )}

      </div>
    </BankPageLayout>
  )
}

export default BankTransactions