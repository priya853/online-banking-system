import { NavLink, useNavigate } from 'react-router-dom'
import './AdminBank.css'

function AdminPageLayout({
  title,
  subtitle,
  children,
  onLogout,
}) {
  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem('jwtToken')

    if (onLogout) {
      onLogout()
    }

    navigate('/login')
  }

  return (
    <div className="admin-bank-page">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="admin-bank-header">

        <div className="admin-bank-header-inner">

          {/* ================= LOGO ================= */}
          <div className="admin-bank-logo">

            <span className="admin-bank-logo-icon">
              🏦
            </span>

            <NavLink
              to="/admin/dashboard"
              className="admin-bank-logo-text"
            >
              Online Banking
            </NavLink>

            <span className="admin-bank-badge">
              ADMIN
            </span>

          </div>

          {/* ================= NAVIGATION ================= */}
          <div className="admin-bank-nav-wrapper">

            <nav className="admin-bank-nav">

              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/register-manager"
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                Register Manager
              </NavLink>

              <NavLink
                to="/admin/add-bank"
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                Add Bank
              </NavLink>

              <NavLink
                to="/admin/create-account"
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                Create Account
              </NavLink>

              <NavLink
                to="/admin/banks"
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                All Banks
              </NavLink>

              <NavLink
  to="/admin/managers"
  className={({ isActive }) =>
    isActive ? 'active' : ''
  }
>
  Bank Managers
</NavLink>

              <NavLink
                to="/admin/customers"
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                Customers
              </NavLink>

              <NavLink
                to="/admin/accounts"
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                Accounts
              </NavLink>

              <NavLink
                to="/admin/transactions"
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                Transactions
              </NavLink>

            </nav>

          </div>

          {/* ================= LOGOUT ================= */}
          <button
            type="button"
            className="admin-bank-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* =====================================================
          PAGE TITLE
      ===================================================== */}
      <section className="admin-bank-title">

        <h1>{title}</h1>

        {subtitle && (
          <p>{subtitle}</p>
        )}

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="admin-bank-content">
        {children}
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="admin-bank-footer">
        <p>
          © 2026 Online Banking. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default AdminPageLayout