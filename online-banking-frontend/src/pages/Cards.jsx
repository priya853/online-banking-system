import { useState } from 'react'
import PageLayout from './PageLayout'

function Cards() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <PageLayout
      title="Cards"
      subtitle="Manage your banking cards and card services."
    >
      <div style={{ display: 'grid', gap: '20px' }}>
        <div className="bank-panel">
          <h2 className="bank-section-title">
            My Debit Card
          </h2>

          <div
            style={{
              maxWidth: '430px',
              padding: '24px',
              borderRadius: '12px',
              background: '#7d1007',
              color: '#fff',
              boxShadow: '0 5px 12px rgba(80,30,10,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '35px',
              }}
            >
              <strong>ONLINE BANKING</strong>
              <span>VISA</span>
            </div>

            <p
              style={{
                marginBottom: '25px',
                letterSpacing: '3px',
                fontSize: '17px',
              }}
            >
              {showDetails
                ? '4587 1234 5678 8173'
                : 'XXXX XXXX XXXX 8173'}
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
              }}
            >
              <span>CARD HOLDER</span>
              <span>VALID THRU 12/29</span>
            </div>
          </div>

          <div className="bank-button-row">
            <button
              type="button"
              className="bank-button"
              onClick={() =>
                setShowDetails((previous) => !previous)
              }
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>

        <div className="bank-info-grid">
          <div className="bank-info-card">
            <h3>Debit Card</h3>
            <p>
              Convenient card payments and ATM withdrawals.
            </p>
            <button
              type="button"
              className="bank-button"
              onClick={() => alert('Debit card service selected.')}
            >
              Manage
            </button>
          </div>

          <div className="bank-info-card">
            <h3>Credit Card</h3>
            <p>
              Flexible spending with credit facilities.
            </p>
            <button
              type="button"
              className="bank-button"
              onClick={() => alert('Credit card service selected.')}
            >
              Explore
            </button>
          </div>

          <div className="bank-info-card">
            <h3>Card Security</h3>
            <p>
              Block, replace and manage card security settings.
            </p>
            <button
              type="button"
              className="bank-button"
              onClick={() =>
                alert('Card security service selected.')
              }
            >
              Security
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Cards