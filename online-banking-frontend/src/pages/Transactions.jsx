import { useEffect, useMemo, useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import PageLayout from './PageLayout'

function Transactions({ onLogout }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  const token = sessionStorage.getItem('jwtToken')

  async function fetchTransactions() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/transactions/my-transactions',
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
      return String(dateValue)
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

    return transactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        String(transaction.id || '')
          .toLowerCase()
          .includes(query) ||
        String(transaction.accountNumber || '')
          .toLowerCase()
          .includes(query) ||
        String(transaction.type || '')
          .toLowerCase()
          .includes(query) ||
        String(transaction.amount || '')
          .toLowerCase()
          .includes(query)

      const matchesType =
        typeFilter === 'ALL' ||
        String(transaction.type || '').toUpperCase() ===
          typeFilter

      return matchesSearch && matchesType
    })
  }, [transactions, searchTerm, typeFilter])

  function downloadCSV() {
    if (filteredTransactions.length === 0) {
      alert('No transactions available for download.')
      return
    }

    const headers = [
      'Transaction ID',
      'Account Number',
      'Transaction Type',
      'Amount',
      'Balance After Transaction',
      'Transaction Date',
    ]

    const rows = filteredTransactions.map((transaction) => [
      transaction.id ?? '',
      transaction.accountNumber ?? '',
      transaction.type ?? '',
      transaction.amount ?? '',
      transaction.balanceAfterTransaction ?? '',
      formatDate(transaction.transactionDate),
    ])

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? '')
            return `"${text.replace(/"/g, '""')}"`
          })
          .join(',')
      )
      .join('\n')

    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;',
      }
    )

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `bank-statement-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  function downloadPDF() {
    if (filteredTransactions.length === 0) {
      alert('No transactions available for download.')
      return
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('ONLINE BANKING', 14, 15)

    doc.setFontSize(14)
    doc.text('BANK STATEMENT', 14, 24)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    doc.text(
      `Generated On: ${new Date().toLocaleString('en-IN')}`,
      14,
      32
    )

    doc.text(
      `Total Transactions: ${filteredTransactions.length}`,
      14,
      38
    )

    const tableRows = filteredTransactions.map(
      (transaction) => [
        transaction.id ?? '',
        transaction.accountNumber ?? '',
        transaction.type ?? '',
        `Rs. ${formatAmount(transaction.amount)}`,
        `Rs. ${formatAmount(
          transaction.balanceAfterTransaction
        )}`,
        formatDate(transaction.transactionDate),
      ]
    )

    autoTable(doc, {
      startY: 45,

      head: [
        [
          'Transaction ID',
          'Account Number',
          'Type',
          'Amount',
          'Balance',
          'Date',
        ],
      ],

      body: tableRows,

      theme: 'grid',

      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [70, 45, 35],
      },

      headStyles: {
        fillColor: [139, 22, 13],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },

      alternateRowStyles: {
        fillColor: [255, 244, 220],
      },

      margin: {
        left: 14,
        right: 14,
      },
    })

    const finalY =
      doc.lastAutoTable?.finalY || 60

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    doc.text(
      'This statement is generated from your Online Banking transaction records.',
      14,
      finalY + 12
    )

    doc.save(
      `bank-statement-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    )
  }

  function clearFilters() {
    setSearchTerm('')
    setTypeFilter('ALL')
  }

  return (
    <PageLayout
      title="Transactions"
      subtitle="View and download your banking transaction history."
      onLogout={onLogout}
    >
      <div className="bank-panel">

        <h2 className="bank-section-title">
          Transaction History
        </h2>

        {/* SEARCH + FILTER */}
        <div
          className="bank-search-row"
          style={{
            alignItems: 'stretch',
            flexWrap: 'wrap',
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search transaction ID, account number, type or amount..."
          />

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
            style={{
              minWidth: '150px',
              padding: '10px 12px',
              border: '1px solid #cdb58f',
              borderRadius: '4px',
              background: '#ffffff',
              color: '#4e3025',
            }}
          >
            <option value="ALL">
              All Types
            </option>

            <option value="DEPOSIT">
              Deposit
            </option>

            <option value="WITHDRAW">
              Withdraw
            </option>

            <option value="TRANSFER">
              Transfer
            </option>
          </select>

          <button
            type="button"
            className="bank-button secondary"
            onClick={clearFilters}
            disabled={!searchTerm && typeFilter === 'ALL'}
          >
            Clear
          </button>
        </div>

        {/* DOWNLOAD BUTTONS */}
        {!loading &&
          !error &&
          transactions.length > 0 && (
            <div
              className="bank-button-row"
              style={{
                marginTop: '5px',
                marginBottom: '18px',
              }}
            >
              <button
                type="button"
                className="bank-button"
                onClick={downloadPDF}
                disabled={filteredTransactions.length === 0}
              >
                Download PDF
              </button>

              <button
                type="button"
                className="bank-button secondary"
                onClick={downloadCSV}
                disabled={filteredTransactions.length === 0}
              >
                Download CSV
              </button>
            </div>
          )}

        {/* RESULT COUNT */}
        {!loading &&
          !error &&
          transactions.length > 0 && (
            <div
              style={{
                marginBottom: '12px',
                color: '#6b4b3e',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              Showing {filteredTransactions.length} of{' '}
              {transactions.length} transactions
            </div>
          )}

        {/* LOADING */}
        {loading && (
          <div className="empty-state">
            Loading transactions...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bank-error">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          transactions.length === 0 && (
            <div className="empty-state">
              No transactions found.
            </div>
          )}

        {/* NO SEARCH RESULT */}
        {!loading &&
          !error &&
          transactions.length > 0 &&
          filteredTransactions.length === 0 && (
            <div className="empty-state">
              No matching transactions found.
            </div>
          )}

        {/* TRANSACTION TABLE */}
        {!loading &&
          !error &&
          filteredTransactions.length > 0 && (
            <div className="bank-table-wrapper">

              <table className="bank-table">

                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Transaction ID</th>
                    <th>Account Number</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Balance After Transaction</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map(
                    (transaction, index) => (
                      <tr key={transaction.id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {transaction.id}
                        </td>

                        <td
                          style={{
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {transaction.accountNumber}
                        </td>

                        <td>
                          <span
                            className={`bank-status ${
                              String(
                                transaction.type || ''
                              ).toUpperCase() ===
                              'WITHDRAW'
                                ? 'blocked'
                                : 'active'
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>

                        <td
                          style={{
                            fontWeight: '700',
                          }}
                        >
                          ₹
                          {formatAmount(
                            transaction.amount
                          )}
                        </td>

                        <td
                          style={{
                            fontWeight: '700',
                          }}
                        >
                          ₹
                          {formatAmount(
                            transaction.balanceAfterTransaction
                          )}
                        </td>

                        <td>
                          {formatDate(
                            transaction.transactionDate
                          )}
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>

            </div>
          )}

      </div>
    </PageLayout>
  )
}

export default Transactions