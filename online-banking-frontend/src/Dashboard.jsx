import { useCallback, useEffect, useState } from 'react'
import PageLayout from './pages/PageLayout'
import './Dashboard.css'

function Dashboard({ onLogout }) {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])

  const [accountNumber, setAccountNumber] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')

  const [senderAccountNumber, setSenderAccountNumber] =
    useState('')
  const [receiverAccountNumber, setReceiverAccountNumber] =
    useState('')
  const [transferAmount, setTransferAmount] =
    useState('')

  const [loading, setLoading] = useState(true)
  const [operationLoading, setOperationLoading] =
    useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = sessionStorage.getItem('jwtToken')

  const fetchAccounts = useCallback(async () => {
    const response = await fetch(
      'http://localhost:8080/api/accounts/my-accounts',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to load accounts (${response.status})`
      )
    }

    const data = await response.json()
    setAccounts(Array.isArray(data) ? data : [])
  }, [token])

  const fetchTransactions = useCallback(async () => {
    const response = await fetch(
      'http://localhost:8080/api/transactions/my-transactions',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to load transactions (${response.status})`
      )
    }

    const data = await response.json()
    setTransactions(Array.isArray(data) ? data : [])
  }, [token])

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      await Promise.all([
        fetchAccounts(),
        fetchTransactions(),
      ])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [fetchAccounts, fetchTransactions])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  function formatAmount(amount) {
    return Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  function resetMessages() {
    setError('')
    setSuccess('')
  }

  async function handleDeposit(event) {
    event.preventDefault()
    resetMessages()

    if (!accountNumber || !depositAmount) {
      setError('Please select an account and enter amount.')
      return
    }

    setOperationLoading(true)

    try {
      const response = await fetch(
        `http://localhost:8080/api/accounts/${accountNumber}/deposit`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Number(depositAmount),
          }),
        }
      )

      if (!response.ok) {
        throw new Error(
          `Deposit failed (${response.status})`
        )
      }

      setSuccess('Amount deposited successfully.')
      setDepositAmount('')

      await loadDashboard()
    } catch (err) {
      setError(err.message)
    } finally {
      setOperationLoading(false)
    }
  }

  async function handleWithdraw(event) {
    event.preventDefault()
    resetMessages()

    if (!accountNumber || !withdrawAmount) {
      setError('Please select an account and enter amount.')
      return
    }

    setOperationLoading(true)

    try {
      const response = await fetch(
        `http://localhost:8080/api/accounts/${accountNumber}/withdraw`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Number(withdrawAmount),
          }),
        }
      )

      if (!response.ok) {
        const text = await response.text()

        throw new Error(
          text || `Withdrawal failed (${response.status})`
        )
      }

      setSuccess('Amount withdrawn successfully.')
      setWithdrawAmount('')

      await loadDashboard()
    } catch (err) {
      setError(err.message)
    } finally {
      setOperationLoading(false)
    }
  }

  async function handleTransfer(event) {
    event.preventDefault()
    resetMessages()

    if (
      !senderAccountNumber ||
      !receiverAccountNumber ||
      !transferAmount
    ) {
      setError('Please fill in all transfer fields.')
      return
    }

    if (
      senderAccountNumber === receiverAccountNumber
    ) {
      setError(
        'Sender and receiver account numbers must be different.'
      )
      return
    }

    setOperationLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/transfers',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderAccountNumber,
            receiverAccountNumber,
            amount: Number(transferAmount),
          }),
        }
      )

      if (!response.ok) {
        const text = await response.text()

        throw new Error(
          text || `Transfer failed (${response.status})`
        )
      }

      setSuccess('Money transferred successfully.')

      setSenderAccountNumber('')
      setReceiverAccountNumber('')
      setTransferAmount('')

      await loadDashboard()
    } catch (err) {
      setError(err.message)
    } finally {
      setOperationLoading(false)
    }
  }

  const totalBalance = accounts.reduce(
    (total, account) =>
      total + Number(account.balance || 0),
    0
  )

  return (
    <PageLayout
      title="Customer Dashboard"
      subtitle="Manage your accounts and banking transactions."
      onLogout={onLogout}
    >
      <div className="customer-dashboard-content">
        {/* Summary */}
        <div className="bank-info-grid">
          <div className="bank-info-card">
            <h3>Total Balance</h3>

            <p
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#7d1007',
              }}
            >
              ₹
              {loading
                ? '...'
                : formatAmount(totalBalance)}
            </p>
          </div>

          <div className="bank-info-card">
            <h3>My Accounts</h3>

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
            <h3>Transactions</h3>

            <p
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#7d1007',
              }}
            >
              {loading ? '...' : transactions.length}
            </p>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="bank-success">
            {success}
          </div>
        )}

        {error && (
          <div className="bank-error">
            {error}
          </div>
        )}

        {/* Deposit / Withdraw */}
       <div className="bank-action-grid">
          <div className="bank-panel">
            <h2 className="bank-section-title">
              Deposit Money
            </h2>

            <form onSubmit={handleDeposit}>
              <div className="bank-field">
                <label htmlFor="deposit-account">
                  Account Number
                </label>

                <select
                  id="deposit-account"
                  value={accountNumber}
                  onChange={(event) =>
                    setAccountNumber(event.target.value)
                  }
                >
                  <option value="">
                    Select account
                  </option>

                  {accounts.map((account) => (
                    <option
                      key={account.accountNumber}
                      value={account.accountNumber}
                    >
                      {account.accountNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="bank-field"
                style={{ marginTop: '12px' }}
              >
                <label htmlFor="deposit-amount">
                  Amount
                </label>

                <input
                  id="deposit-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(event) =>
                    setDepositAmount(event.target.value)
                  }
                />
              </div>

              <div className="bank-button-row">
                <button
                  type="submit"
                  className="bank-button"
                  disabled={operationLoading}
                >
                  {operationLoading
                    ? 'Processing...'
                    : 'Deposit'}
                </button>
              </div>
            </form>
          </div>

          <div className="bank-panel">
            <h2 className="bank-section-title">
              Withdraw Money
            </h2>

            <form onSubmit={handleWithdraw}>
              <div className="bank-field">
                <label htmlFor="withdraw-account">
                  Account Number
                </label>

                <select
                  id="withdraw-account"
                  value={accountNumber}
                  onChange={(event) =>
                    setAccountNumber(event.target.value)
                  }
                >
                  <option value="">
                    Select account
                  </option>

                  {accounts.map((account) => (
                    <option
                      key={account.accountNumber}
                      value={account.accountNumber}
                    >
                      {account.accountNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="bank-field"
                style={{ marginTop: '12px' }}
              >
                <label htmlFor="withdraw-amount">
                  Amount
                </label>

                <input
                  id="withdraw-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(event) =>
                    setWithdrawAmount(event.target.value)
                  }
                />
              </div>

              <div className="bank-button-row">
                <button
                  type="submit"
                  className="bank-button"
                  disabled={operationLoading}
                >
                  {operationLoading
                    ? 'Processing...'
                    : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Transfer */}
        <div className="bank-panel">
          <h2 className="bank-section-title">
            Transfer Money
          </h2>

          <form onSubmit={handleTransfer}>
            <div className="bank-form-grid">
              <div className="bank-field">
                <label htmlFor="sender-account">
                  Sender Account
                </label>

                <select
                  id="sender-account"
                  value={senderAccountNumber}
                  onChange={(event) =>
                    setSenderAccountNumber(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select sender account
                  </option>

                  {accounts.map((account) => (
                    <option
                      key={account.accountNumber}
                      value={account.accountNumber}
                    >
                      {account.accountNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bank-field">
                <label htmlFor="receiver-account">
                  Receiver Account
                </label>

                <input
                  id="receiver-account"
                  type="text"
                  placeholder="Enter receiver account"
                  value={receiverAccountNumber}
                  onChange={(event) =>
                    setReceiverAccountNumber(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="bank-field">
                <label htmlFor="transfer-amount">
                  Transfer Amount
                </label>

                <input
                  id="transfer-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  value={transferAmount}
                  onChange={(event) =>
                    setTransferAmount(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="bank-button-row">
              <button
                type="submit"
                className="bank-button"
                disabled={operationLoading}
              >
                {operationLoading
                  ? 'Processing...'
                  : 'Transfer Money'}
              </button>
            </div>
          </form>
        </div>

        {/* Accounts */}
        <div className="bank-panel">
          <h2 className="bank-section-title">
            My Bank Accounts
          </h2>

          {accounts.length === 0 && !loading ? (
            <div className="empty-state">
              No accounts found.
            </div>
          ) : (
            <div className="bank-table-wrapper">
              <table className="bank-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Account Number</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {accounts.map((account, index) => (
                    <tr key={account.id}>
                      <td>{index + 1}</td>

                      <td>{account.accountNumber}</td>

                      <td>
                        ₹{formatAmount(account.balance)}
                      </td>

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

        {/* Recent Transactions */}
        <div className="bank-panel">
          <h2 className="bank-section-title">
            Recent Transactions
          </h2>

          {transactions.length === 0 && !loading ? (
            <div className="empty-state">
              No transactions found.
            </div>
          ) : (
            <div className="bank-table-wrapper">
              <table className="bank-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Account</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.slice(0, 8).map(
                    (transaction, index) => (
                      <tr key={transaction.id}>
                        <td>{index + 1}</td>
                        <td>
                          {transaction.accountNumber}
                        </td>

                        <td>
                          <span
                            className={`bank-status ${
                              String(
                                transaction.type
                              ).toUpperCase() ===
                              'WITHDRAW'
                                ? 'blocked'
                                : 'active'
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>

                        <td>
                          ₹
                          {formatAmount(
                            transaction.amount
                          )}
                        </td>

                        <td>
                          {transaction.transactionDate
                            ? new Date(
                                transaction.transactionDate
                              ).toLocaleString('en-IN')
                            : '-'}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default Dashboard