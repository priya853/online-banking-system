import { NavLink } from 'react-router-dom'

function Sidebar({ onLogout }) {
  const getLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">₹</div>

        <h2>
          FinBank<span>.</span>
        </h2>
      </div>

      <p className="sidebar-label">MAIN MENU</p>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={getLinkClass}>
          <span>▦</span>
          Dashboard
        </NavLink>

        <NavLink to="/about-us" className={getLinkClass}>
          <span>ℹ</span>
          About Us
        </NavLink>

        <NavLink to="/accounts" className={getLinkClass}>
          <span>▤</span>
          Accounts
        </NavLink>

        <NavLink to="/transactions" className={getLinkClass}>
  <span>↕</span>
  Transactions
</NavLink>

        <NavLink to="/loans" className={getLinkClass}>
          <span>◈</span>
          Loans
        </NavLink>

        <NavLink to="/cards" className={getLinkClass}>
          <span>▣</span>
          Cards
        </NavLink>
      </nav>

      <p className="sidebar-label">SERVICES</p>

      <nav className="sidebar-nav">
        <NavLink to="/personal" className={getLinkClass}>
          <span>♙</span>
          Personal
        </NavLink>

        <NavLink to="/business" className={getLinkClass}>
          <span>▥</span>
          Business
        </NavLink>

        <NavLink to="/corporate" className={getLinkClass}>
          <span>▦</span>
          Corporate
        </NavLink>

        <NavLink
          to="/customer-service"
          className={getLinkClass}
        >
          <span>☎</span>
          Customer Service
        </NavLink>

        <NavLink to="/contact-us" className={getLinkClass}>
          <span>✉</span>
          Contact Us
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="support-box">
          <span>💬</span>

          <strong>Need help?</strong>

          <p>Contact our support team.</p>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar