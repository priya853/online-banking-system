import { NavLink } from 'react-router-dom'

function AdminSidebar({ onLogout }) {
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

      <p className="sidebar-label">ADMIN PANEL</p>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={getLinkClass}
        >
          <span>▦</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/register-manager"
          className={getLinkClass}
        >
          <span>♙</span>
          Register Manager
        </NavLink>

        <NavLink
          to="/admin/add-bank"
          className={getLinkClass}
        >
          <span>＋</span>
          Add Bank
        </NavLink>

        <NavLink
          to="/admin/banks"
          className={getLinkClass}
        >
          <span>🏦</span>
          View Banks
        </NavLink>

        <NavLink
          to="/admin/managers"
          className={getLinkClass}
        >
          <span>♟</span>
          Bank Managers
        </NavLink>

        <NavLink
          to="/admin/customers"
          className={getLinkClass}
        >
          <span>👥</span>
          All Customers
        </NavLink>

        <NavLink
          to="/admin/accounts"
          className={getLinkClass}
        >
          <span>▤</span>
          All Bank Accounts
        </NavLink>

        <NavLink
          to="/admin/transactions"
          className={getLinkClass}
        >
          <span>↕</span>
          All Transactions
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="support-box">
          <span>⚙</span>
          <strong>Admin Control</strong>
          <p>Manage the banking system.</p>
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

export default AdminSidebar