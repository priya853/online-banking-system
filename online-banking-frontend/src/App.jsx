import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'

import Login from './Login'
import Register from './Register'
import AdminDashboard from './AdminDashboard'
import BankDashboard from './BankDashboard'
import Dashboard from './Dashboard'

import AboutUs from './pages/AboutUs'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import Loans from './pages/Loans'
import Cards from './pages/Cards'
import Personal from './pages/Personal'
import Business from './pages/Business'
import Corporate from './pages/Corporate'
import CustomerService from './pages/CustomerService'
import ContactUs from './pages/ContactUs'
import BankCustomers from './pages/BankCustomers'
import BankAccounts from './pages/BankAccounts'
import BankTransactions from './pages/BankTransactions'

import RegisterManager from './admin/RegisterManager'
import AddBank from './admin/AddBank'
import CreateBankAccount from './admin/CreateBankAccount'
import ViewBanks from './admin/ViewBanks'
import BankManagers from './admin/BankManagers'
import AllCustomers from './admin/AllCustomers'
import AllBankAccounts from './admin/AllBankAccounts'
import AllBankTransactions from './admin/AllBankTransactions'

import './App.css'

function normalizeRole(role) {
  const normalized = String(role || '')
    .trim()
    .toUpperCase()

  if (
    normalized === 'ADMIN' ||
    normalized === 'ROLE_ADMIN'
  ) {
    return 'ROLE_ADMIN'
  }

  if (
    normalized === 'BANK' ||
    normalized === 'ROLE_BANK'
  ) {
    return 'ROLE_BANK'
  }

  if (
    normalized === 'CUSTOMER' ||
    normalized === 'ROLE_CUSTOMER' ||
    normalized === 'USER' ||
    normalized === 'ROLE_USER'
  ) {
    return 'ROLE_CUSTOMER'
  }

  return normalized
}

function getRoleFromJwt(token) {
  try {
    if (!token) {
      return ''
    }

    const parts = token.split('.')

    if (parts.length < 2) {
      return ''
    }

    const normalizedPayload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length +
        ((4 - (normalizedPayload.length % 4)) % 4),
      '='
    )

    const payload = JSON.parse(atob(paddedPayload))

    const directRole =
      payload.role ||
      payload.userRole ||
      payload.authority

    if (
      typeof directRole === 'string' &&
      directRole.trim()
    ) {
      return normalizeRole(directRole)
    }

    const arrays = [
      payload.roles,
      payload.authorities,
    ]

    for (const value of arrays) {
      if (!Array.isArray(value)) {
        continue
      }

      const stringRole = value.find(
        (item) =>
          typeof item === 'string' &&
          item.trim()
      )

      if (stringRole) {
        return normalizeRole(stringRole)
      }

      const objectRole = value.find(
        (item) =>
          item &&
          typeof item.authority === 'string'
      )

      if (objectRole) {
        return normalizeRole(objectRole.authority)
      }
    }

    if (typeof payload.scope === 'string') {
      const scopeRole = payload.scope
        .split(' ')
        .find((item) => {
          const value = item.toUpperCase()

          return (
            value.includes('ADMIN') ||
            value.includes('BANK') ||
            value.includes('CUSTOMER') ||
            value.includes('USER')
          )
        })

      if (scopeRole) {
        return normalizeRole(scopeRole)
      }
    }
  } catch {
    return ''
  }

  return ''
}

function roleRoute(role) {
  const normalizedRole = normalizeRole(role)

  if (normalizedRole === 'ROLE_ADMIN') {
    return '/admin/dashboard'
  }

  if (normalizedRole === 'ROLE_BANK') {
    return '/bank/dashboard'
  }

  return '/dashboard'
}

function loginRoute(role) {
  const normalizedRole = normalizeRole(role)

  if (normalizedRole === 'ROLE_ADMIN') {
    return '/admin/login'
  }

  if (normalizedRole === 'ROLE_BANK') {
    return '/bank/login'
  }

  return '/login'
}

function AppContent() {
  const navigate = useNavigate()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken')
    const storedRole = sessionStorage.getItem('userRole')

    if (!token) {
      setIsAuthenticated(false)
      setRole('')
      setCheckingSession(false)
      return
    }

    const restoredRole =
      normalizeRole(storedRole) ||
      getRoleFromJwt(token)

    if (!restoredRole) {
      sessionStorage.removeItem('jwtToken')
      sessionStorage.removeItem('userRole')
      sessionStorage.removeItem('userName')

      setIsAuthenticated(false)
      setRole('')
      setCheckingSession(false)
      return
    }

    sessionStorage.setItem('userRole', restoredRole)
    setIsAuthenticated(true)
    setRole(restoredRole)
    setCheckingSession(false)
  }, [])

  function handleLoginSuccess(loginRole) {
    const normalizedRole = normalizeRole(loginRole)

    if (!normalizedRole) {
      sessionStorage.removeItem('jwtToken')
      sessionStorage.removeItem('userRole')
      sessionStorage.removeItem('userName')

      setIsAuthenticated(false)
      setRole('')
      setCheckingSession(false)
      setTimeout(() => navigate('/login', { replace: true }), 0)
      return
    }

    sessionStorage.setItem('userRole', normalizedRole)

    setIsAuthenticated(true)
    setRole(normalizedRole)
    setCheckingSession(false)

    navigate(roleRoute(normalizedRole), {
      replace: true,
    })
  }

  function handleLogout() {
    sessionStorage.removeItem('jwtToken')
    sessionStorage.removeItem('userRole')
    sessionStorage.removeItem('userName')

    setIsAuthenticated(false)
    setRole('')

    navigate('/login', { replace: true })
  }

  if (checkingSession) {
    return (
      <div
        className="app-loading-screen"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff4dc',
          color: '#8b160d',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: '18px',
          fontWeight: '700',
        }}
      >
        Loading Online Banking...
      </div>
    )
  }

  const normalizedRole = normalizeRole(role)
  const isCustomer =
    isAuthenticated &&
    normalizedRole === 'ROLE_CUSTOMER'
  const isAdmin =
    isAuthenticated &&
    normalizedRole === 'ROLE_ADMIN'
  const isBank =
    isAuthenticated &&
    normalizedRole === 'ROLE_BANK'

  return (
    <Routes>
      {/* =====================================================
          PUBLIC LANDING PAGE
      ===================================================== */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to={roleRoute(normalizedRole)}
              replace
            />
          ) : (
            <AboutUs />
          )
        }
      />

      {/* =====================================================
          CUSTOMER / COMMON LOGIN
      ===================================================== */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={roleRoute(normalizedRole)}
              replace
            />
          ) : (
            <Login
              onLoginSuccess={handleLoginSuccess}
            />
          )
        }
      />

      {/* =====================================================
          ADMIN LOGIN - SAME Login.jsx
      ===================================================== */}
      <Route
        path="/admin/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={roleRoute(normalizedRole)}
              replace
            />
          ) : (
            <Login
              onLoginSuccess={handleLoginSuccess}
            />
          )
        }
      />

      {/* =====================================================
          BANK LOGIN - SAME Login.jsx
      ===================================================== */}
      <Route
        path="/bank/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={roleRoute(normalizedRole)}
              replace
            />
          ) : (
            <Login
              onLoginSuccess={handleLoginSuccess}
            />
          )
        }
      />

      {/* =====================================================
          CUSTOMER REGISTER
      ===================================================== */}
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate
              to={roleRoute(normalizedRole)}
              replace
            />
          ) : (
            <Register />
          )
        }
      />

      {/* =====================================================
          CUSTOMER DASHBOARD
      ===================================================== */}
      <Route
        path="/dashboard"
        element={
          isCustomer ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      {/* =====================================================
          CUSTOMER PAGES
      ===================================================== */}
      <Route
        path="/dashboard/accounts"
        element={
          isCustomer ? (
            <Accounts onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/dashboard/transactions"
        element={
          isCustomer ? (
            <Transactions onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/dashboard/loans"
        element={
          isCustomer ? (
            <Loans onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/dashboard/cards"
        element={
          isCustomer ? (
            <Cards onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/dashboard/personal"
        element={
          isCustomer ? (
            <Personal onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/dashboard/business"
        element={
          isCustomer ? (
            <Business onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/dashboard/corporate"
        element={
          isCustomer ? (
            <Corporate onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/dashboard/customer-service"
        element={
          isCustomer ? (
            <CustomerService onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/dashboard/contact"
        element={
          isCustomer ? (
            <ContactUs onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/dashboard/about"
        element={
          isCustomer ? (
            <AboutUs />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      {/* =====================================================
          BACKWARD-COMPATIBLE CUSTOMER ALIASES
      ===================================================== */}
      <Route
        path="/about-us"
        element={
          isCustomer ? (
            <AboutUs />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/accounts"
        element={
          isCustomer ? (
            <Accounts onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/transactions"
        element={
          isCustomer ? (
            <Transactions onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/loans"
        element={
          isCustomer ? (
            <Loans onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/cards"
        element={
          isCustomer ? (
            <Cards onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/personal"
        element={
          isCustomer ? (
            <Personal onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/business"
        element={
          isCustomer ? (
            <Business onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/corporate"
        element={
          isCustomer ? (
            <Corporate onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/customer-service"
        element={
          isCustomer ? (
            <CustomerService onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/contact-us"
        element={
          isCustomer ? (
            <ContactUs onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/login'}
              replace
            />
          )
        }
      />

      {/* =====================================================
          BANK
      ===================================================== */}
      <Route
        path="/bank"
        element={
          isBank ? (
            <Navigate
              to="/bank/dashboard"
              replace
            />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/bank/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/bank/dashboard"
        element={
          isBank ? (
            <BankDashboard onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/bank/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/bank/customers"
        element={
          isBank ? (
            <BankCustomers onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/bank/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/bank/accounts"
        element={
          isBank ? (
            <BankAccounts onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/bank/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/bank/transactions"
        element={
          isBank ? (
            <BankTransactions onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/bank/login'}
              replace
            />
          )
        }
      />

      {/* =====================================================
          ADMIN
      ===================================================== */}
      <Route
        path="/admin"
        element={
          isAdmin ? (
            <Navigate
              to="/admin/dashboard"
              replace
            />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/admin/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          isAdmin ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/admin/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/admin/register-manager"
        element={
          isAdmin ? (
            <RegisterManager onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/admin/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/admin/add-bank"
        element={
          isAdmin ? (
            <AddBank onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/admin/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/admin/create-account"
        element={
          isAdmin ? (
            <CreateBankAccount onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/admin/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/admin/banks"
        element={
          isAdmin ? (
            <ViewBanks onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/admin/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/admin/managers"
        element={
          isAdmin ? (
            <BankManagers onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/admin/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/admin/customers"
        element={
          isAdmin ? (
            <AllCustomers onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/admin/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/admin/accounts"
        element={
          isAdmin ? (
            <AllBankAccounts onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/admin/login'}
              replace
            />
          )
        }
      />

      <Route
        path="/admin/transactions"
        element={
          isAdmin ? (
            <AllBankTransactions onLogout={handleLogout} />
          ) : (
            <Navigate
              to={isAuthenticated ? roleRoute(normalizedRole) : '/admin/login'}
              replace
            />
          )
        }
      />

      {/* =====================================================
          UNKNOWN URL
      ===================================================== */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? roleRoute(normalizedRole)
                : '/'
            }
            replace
          />
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
