import { useState } from 'react'
import PageLayout from './PageLayout'

function Corporate({ onLogout }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessType: '',
    service: '',
    message: '',
  })

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    setSuccess('')
    setError('')

    if (
      !formData.companyName ||
      !formData.contactPerson ||
      !formData.email ||
      !formData.phone ||
      !formData.service
    ) {
      setError('Please fill in all required fields.')
      return
    }

    setSuccess(
      'Corporate enquiry submitted successfully. Our relationship team will contact you.'
    )

    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      businessType: '',
      service: '',
      message: '',
    })
  }

  return (
    <PageLayout
      title="Corporate Banking"
      subtitle="Banking solutions designed for businesses and corporate customers."
      onLogout={onLogout}
    >
      {/* Services */}
      <div className="bank-panel">
        <h2 className="bank-section-title">
          Corporate Banking Services
        </h2>

        <div className="bank-info-grid">
          <div className="bank-info-card">
            <h3>Corporate Accounts</h3>
            <p>
              Business current and savings account solutions
              for organizations.
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Business Loans</h3>
            <p>
              Financing solutions for business expansion and
              working capital requirements.
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Cash Management</h3>
            <p>
              Manage business collections, payments and daily
              cash flow efficiently.
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Trade Finance</h3>
            <p>
              Banking support for domestic and international
              business transactions.
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Bulk Payments</h3>
            <p>
              Simplified payment solutions for vendors,
              employees and business partners.
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Salary Management</h3>
            <p>
              Convenient salary processing solutions for
              corporate employees.
            </p>
          </div>
        </div>
      </div>

      {/* Enquiry */}
      <div
        className="bank-panel"
        style={{ marginTop: '24px' }}
      >
        <h2 className="bank-section-title">
          Corporate Banking Enquiry
        </h2>

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

        <form onSubmit={handleSubmit}>
          <div className="bank-form-grid">

            <div className="bank-field">
              <label htmlFor="companyName">
                Company Name *
              </label>

              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="bank-field">
              <label htmlFor="contactPerson">
                Contact Person *
              </label>

              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Enter contact person name"
              />
            </div>

            <div className="bank-field">
              <label htmlFor="email">
                Email *
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            <div className="bank-field">
              <label htmlFor="phone">
                Phone *
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="bank-field">
              <label htmlFor="businessType">
                Business Type
              </label>

              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
              >
                <option value="">
                  Select business type
                </option>

                <option value="Private Limited">
                  Private Limited
                </option>

                <option value="Public Limited">
                  Public Limited
                </option>

                <option value="Partnership">
                  Partnership
                </option>

                <option value="Proprietorship">
                  Proprietorship
                </option>

                <option value="LLP">
                  LLP
                </option>
              </select>
            </div>

            <div className="bank-field">
              <label htmlFor="service">
                Required Service *
              </label>

              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="">
                  Select service
                </option>

                <option value="Corporate Account">
                  Corporate Account
                </option>

                <option value="Business Loan">
                  Business Loan
                </option>

                <option value="Cash Management">
                  Cash Management
                </option>

                <option value="Trade Finance">
                  Trade Finance
                </option>

                <option value="Bulk Payments">
                  Bulk Payments
                </option>

                <option value="Salary Management">
                  Salary Management
                </option>
              </select>
            </div>

          </div>

          <div
            className="bank-field"
            style={{ marginTop: '18px' }}
          >
            <label htmlFor="message">
              Message
            </label>

            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your requirement..."
            />
          </div>

          <div className="bank-button-row">
            <button
              type="submit"
              className="bank-button"
            >
              Submit Enquiry
            </button>

            <button
              type="button"
              className="bank-button secondary"
              onClick={() => {
                setFormData({
                  companyName: '',
                  contactPerson: '',
                  email: '',
                  phone: '',
                  businessType: '',
                  service: '',
                  message: '',
                })

                setSuccess('')
                setError('')
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}

export default Corporate