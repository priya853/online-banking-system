import { useEffect, useMemo, useState } from 'react'
import AdminPageLayout from './AdminPageLayout'
import './AllBankTransactions.css'

function AllBankTransactions({ onLogout }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const token = sessionStorage.getItem('jwtToken')

  async function fetchTransactions() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/admin/transactions',
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
            `Failed to load transactions (${response.status})`
        )
      }

      const data = JSON.parse(responseText)

      setTransactions(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  function formatAmount(amount) {
    return Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return 'N/A'
    }

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return dateValue
    }

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return transactions
    }

    return transactions.filter((transaction) => {
      const values = [
        transaction.id,
        transaction.accountNumber,
        transaction.type,
        transaction.amount,
        transaction.balanceAfterTransaction,
        transaction.transactionDate,
      ]

      return values
        .map((value) => String(value || '').toLowerCase())
        .some((value) => value.includes(query))
    })
  }, [transactions, searchTerm])

  function handleClearSearch() {
    setSearchTerm('')
  }

  return (
    <AdminPageLayout
      title="All Bank Transactions"
      subtitle="View all customer banking transactions."
      onLogout={onLogout}
    >
      <div className="all-bank-transactions-content">

        <div className="all-bank-transactions-header">
          <div>
            <span className="all-bank-transactions-eyebrow">
              TRANSACTION MANAGEMENT
            </span>

            <h2>Transaction Records</h2>

            <p>
              Review transaction activity across all registered accounts.
            </p>
          </div>

          <div className="all-bank-transactions-count">
            <span>Total Results</span>
            <strong>{filteredTransactions.length}</strong>
          </div>
        </div>

        {!loading && !error && transactions.length > 0 && (
          <div className="all-bank-transactions-toolbar">

            <div className="all-bank-transactions-search">
              <span
                className="all-bank-transactions-search-icon"
                aria-hidden="true"
              ></span>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search transaction ID, account, type, amount or date..."
              />

              {searchTerm && (
                <button
                  type="button"
                  className="all-bank-transactions-clear-icon"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  X
                </button>
              )}
            </div>

            <button
              type="button"
              className="all-bank-transactions-clear"
              onClick={handleClearSearch}
              disabled={!searchTerm}
            >
              Clear
            </button>

          </div>
        )}

        {!loading &&
          !error &&
          transactions.length > 0 &&
          searchTerm && (
            <div className="all-bank-transactions-result-info">
              Showing <strong>{filteredTransactions.length}</strong> of{' '}
              <strong>{transactions.length}</strong> transactions
            </div>
          )}

        {loading && (
          <div className="all-bank-transactions-state">
            <div className="all-bank-transactions-spinner"></div>
            <span>Loading transactions...</span>
          </div>
        )}

        {!loading && error && (
          <div className="all-bank-transactions-error">
            <strong>Unable to load transactions</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="all-bank-transactions-state">
            <strong>No transactions found.</strong>
          </div>
        )}

        {!loading &&
          !error &&
          transactions.length > 0 &&
          filteredTransactions.length === 0 && (
            <div className="all-bank-transactions-state">
              <strong>No matching transaction found.</strong>
            </div>
          )}

        {!loading &&
          !error &&
          filteredTransactions.length > 0 && (
            <div className="all-bank-transactions-table-panel">

              <div className="all-bank-transactions-table-header">
                <div>
                  <h3>Bank Transaction Directory</h3>
                  <span>
                    {filteredTransactions.length} transaction
                    {filteredTransactions.length === 1 ? '' : 's'} displayed
                  </span>
                </div>
              </div>

              <div className="all-bank-transactions-table-wrap">
                <table className="all-bank-transactions-table">

                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Transaction ID</th>
                      <th>Account Number</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Balance After</th>
                      <th>Transaction Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.map(
                      (transaction, index) => {

                        const isWithdraw =
                          String(transaction.type || '')
                            .toUpperCase() === 'WITHDRAW'

                        return (
                          <tr key={transaction.id}>

                            <td>
                              <span className="all-bank-transactions-index">
                                {index + 1}
                              </span>
                            </td>

                            <td>
                              <span className="all-bank-transactions-id">
                                {transaction.id}
                              </span>
                            </td>

                            <td>
                              <span className="all-bank-transactions-account">
                                {transaction.accountNumber || '-'}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`all-bank-transactions-type ${
                                  isWithdraw
                                    ? 'withdraw'
                                    : 'deposit'
                                }`}
                              >
                                {transaction.type || '-'}
                              </span>
                            </td>

                            <td>
                              <span className="all-bank-transactions-amount">
                                &#8377;{formatAmount(transaction.amount)}
                              </span>
                            </td>

                            <td>
                              <span className="all-bank-transactions-balance">
                                &#8377;{formatAmount(
                                  transaction.balanceAfterTransaction
                                )}
                              </span>
                            </td>

                            <td>
                              <span className="all-bank-transactions-date">
                                {formatDate(
                                  transaction.transactionDate
                                )}
                              </span>
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

export default AllBankTransactions