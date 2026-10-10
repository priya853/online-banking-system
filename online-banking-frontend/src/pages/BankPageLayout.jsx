import { NavLink, useNavigate } from 'react-router-dom'
import './LegacyBank.css'

function BankPageLayout({
  title,
  subtitle,
  children,
  onLogout,
}) {
  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem('jwtToken')
    sessionStorage.removeItem('userRole')
    sessionStorage.removeItem('userName')

    if (onLogout) {
      onLogout()
      return
    }

    navigate('/login', { replace: true })
  }

  return (
    <div className="bank-page">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="bank-header">

        <div className="bank-header-inner">

          {/* Bank Logo */}
          <NavLink
            to="/bank/dashboard"
            className="bank-logo"
          >
            <span className="bank-logo-icon">
              🏦
            </span>

            <span>
              Online Banking
            </span>

            <span className="bank-role-badge">
              BANK
            </span>
          </NavLink>

          {/* Bank Navigation */}
          <nav className="bank-nav">

            <NavLink
              to="/bank/dashboard"
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/bank/customers"
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              Customers
            </NavLink>

            <NavLink
              to="/bank/accounts"
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              Accounts
            </NavLink>

            <NavLink
              to="/bank/transactions"
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              Transactions
            </NavLink>

          </nav>

          {/* Logout */}
          <button
            type="button"
            className="bank-home-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <main className="bank-main">

        <div className="bank-title-bar">

          <h1>
            {title}
          </h1>

          {subtitle && (
            <p>
              {subtitle}
            </p>
          )}

        </div>

        <section className="bank-content">
          {children}
        </section>

      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="bank-footer">

        <div className="bank-footer-inner">

          <div>
            <h3>
              ONLINE BANKING
            </h3>

            <p>
              Bank operations and
              customer service portal.
            </p>
          </div>

          <div>
            <h4>
              SECURITY
            </h4>

            <p>
              Authorized bank
              personnel only.
            </p>
          </div>

          <div>
            <h4>
              CONTACT
            </h4>

            <p>
              support@onlinebanking.com
            </p>

            <p>
              1800-123-4567
            </p>
          </div>

        </div>

        <div className="bank-footer-bottom">
          © 2026 Online Banking.
          All Rights Reserved.
        </div>

      </footer>

    </div>
  )
}

export default BankPageLayout