import { NavLink, Link } from 'react-router-dom'
import './LegacyBank.css'

function PageLayout({
  title,
  subtitle,
  children,
  onLogout,
}) {
  function handlePageLogout() {
    sessionStorage.removeItem('jwtToken')
    window.location.href = '/login'
  }

  const logoutHandler = onLogout || handlePageLogout

  return (
    <div className="bank-page">
      {/* Header */}
      <header className="bank-header">
        <div className="bank-header-inner">
          <Link to="/dashboard" className="bank-logo">
            <span className="bank-logo-icon">🏦</span>
            <span>Online Banking</span>
          </Link>

          <nav className="bank-nav">
            <NavLink to="/dashboard" end>
              Home
            </NavLink>

            <NavLink to="/dashboard/about">
              About Us
            </NavLink>

            <NavLink to="/dashboard/accounts">
              Accounts
            </NavLink>

            <NavLink to="/dashboard/transactions">
              Transactions
            </NavLink>

            <NavLink to="/dashboard/loans">
              Loans
            </NavLink>

            <NavLink to="/dashboard/cards">
              Cards
            </NavLink>

            <NavLink to="/dashboard/personal">
              Personal
            </NavLink>

            <NavLink to="/dashboard/business">
              Business
            </NavLink>

            <NavLink to="/dashboard/corporate">
              Corporate
            </NavLink>

            <NavLink to="/dashboard/customer-service">
              Customer Service
            </NavLink>

            <NavLink to="/dashboard/contact">
              Contact Us
            </NavLink>
          </nav>

          {/* Logout */}
          <button
            type="button"
            className="bank-home-button"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="bank-main">
        <div className="bank-title-bar">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <section className="bank-content">
          {children}
        </section>
      </main>

      {/* Footer */}
      <footer className="bank-footer">
        <div className="bank-footer-inner">
          <div>
            <h3>ONLINE BANKING</h3>
            <p>
              Secure and convenient banking services for your
              financial needs.
            </p>
          </div>

          <div>
            <h4>QUICK LINKS</h4>

            <Link to="/dashboard/about">About Us</Link>
            <Link to="/dashboard/accounts">Accounts</Link>
            <Link to="/dashboard/loans">Loans</Link>
            <Link to="/dashboard/cards">Cards</Link>
          </div>

          <div>
            <h4>SERVICES</h4>

            <Link to="/dashboard/personal">
              Personal Banking
            </Link>

            <Link to="/dashboard/business">
              Business Banking
            </Link>

            <Link to="/dashboard/corporate">
              Corporate Banking
            </Link>

            <Link to="/dashboard/customer-service">
              Customer Service
            </Link>
          </div>

          <div>
            <h4>CONTACT</h4>

            <p>1800-123-4567</p>
            <p>support@finbank.com</p>
          </div>
        </div>

        <div className="bank-footer-bottom">
          © 2026 Online Banking. All Rights Reserved.
        </div>
      </footer>
    </div>
  )
}

export default PageLayout