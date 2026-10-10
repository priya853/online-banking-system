import { useEffect, useMemo, useState } from 'react'
import AdminPageLayout from './AdminPageLayout'
import './BankManagers.css'

function BankManagers({ onLogout }) {
  const [managers, setManagers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = sessionStorage.getItem('jwtToken')

  useEffect(() => {
    async function loadManagers() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          'http://localhost:8080/api/admin/users',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error(
            `Failed to load managers (${response.status})`
          )
        }

        const data = await response.json()

        const list = Array.isArray(data)
          ? data.filter(
              (user) =>
                String(user.role || '').toUpperCase() === 'ROLE_BANK'
            )
          : []

        setManagers(list)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadManagers()
  }, [token])

  const filteredManagers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return managers
    }

    return managers.filter((manager) =>
      [
        manager.id,
        manager.name,
        manager.email,
        manager.role,
        manager.status,
        manager.phone,
        manager.bankName,
        manager.branch,
      ]
        .map((value) => String(value || '').toLowerCase())
        .some((value) => value.includes(query))
    )
  }, [managers, searchTerm])

  return (
    <AdminPageLayout
      title="Bank Managers"
      subtitle="View and manage authorized bank users."
      onLogout={onLogout}
    >
      <div className="bank-managers-content">

        <div className="bank-managers-header">
          <div>
            <span className="bank-managers-eyebrow">
              ADMINISTRATION
            </span>

            <h2>Registered Bank Managers</h2>

            <p>
              Review authorized bank users and their assigned branch details.
            </p>
          </div>

          <div className="bank-managers-count">
            <span>Total Managers</span>
            <strong>{filteredManagers.length}</strong>
          </div>
        </div>

        <div className="bank-managers-toolbar">
          <div className="bank-managers-search">
            <span
              className="bank-managers-search-icon"
              aria-hidden="true"
            ></span>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by ID, name, email, phone, bank or branch..."
            />

            {searchTerm && (
              <button
                type="button"
                className="bank-managers-clear-icon"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            className="bank-managers-clear"
            onClick={() => setSearchTerm('')}
            disabled={!searchTerm}
          >
            Clear
          </button>
        </div>

        {loading && (
          <div className="bank-managers-state">
            <div className="bank-managers-spinner"></div>
            <span>Loading bank managers...</span>
          </div>
        )}

        {!loading && error && (
          <div className="bank-managers-error">
            <strong>Unable to load bank managers</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && filteredManagers.length === 0 && (
          <div className="bank-managers-state">
            <strong>
              {searchTerm
                ? 'No matching bank manager found.'
                : 'No bank managers registered yet.'}
            </strong>
          </div>
        )}

        {!loading && !error && filteredManagers.length > 0 && (
          <div className="bank-managers-table-panel">
            <div className="bank-managers-table-header">
              <div>
                <h3>Manager Directory</h3>
                <span>
                  Showing {filteredManagers.length} manager
                  {filteredManagers.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="bank-managers-table-wrap">
              <table className="bank-managers-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Manager ID</th>
                    <th>Manager</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Bank</th>
                    <th>Branch</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredManagers.map((manager, index) => (
                    <tr key={manager.id}>
                      <td>
                        <span className="bank-managers-index">
                          {index + 1}
                        </span>
                      </td>

                      <td>
                        <span className="bank-managers-id">
                          {manager.id}
                        </span>
                      </td>

                      <td>
                        <div className="bank-managers-name-cell">
                          <div className="bank-managers-avatar">
                            {(manager.name || 'M')
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>{manager.name || '-'}</strong>
                            <span>Bank Manager</span>
                          </div>
                        </div>
                      </td>

                      <td>{manager.email || '-'}</td>

                      <td>{manager.phone || '-'}</td>

                      <td>{manager.bankName || '-'}</td>

                      <td>{manager.branch || '-'}</td>

                      <td>
                        <span className="bank-managers-role">
                          {manager.role || '-'}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`bank-managers-status ${
                            String(manager.status || '').toUpperCase() ===
                            'ACTIVE'
                              ? 'active'
                              : 'blocked'
                          }`}
                        >
                          {manager.status || '-'}
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

export default BankManagers