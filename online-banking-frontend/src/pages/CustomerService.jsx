import { useMemo, useState } from 'react'
import PageLayout from './PageLayout'

function CustomerService({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accountNumber: '',
    issueType: '',
    description: '',
  })

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const helpTopics = [
    {
      title: 'Login Issues',
      description:
        'Get help with login, password and authentication problems.',
    },
    {
      title: 'Account Issues',
      description:
        'Support for account details, balances and account-related queries.',
    },
    {
      title: 'Card Issues',
      description:
        'Help with debit cards, card blocking and card-related services.',
    },
    {
      title: 'Transaction Issues',
      description:
        'Support for failed, pending or incorrect transactions.',
    },
    {
      title: 'Password Reset',
      description:
        'Guidance for changing or resetting your login password.',
    },
    {
      title: 'Statement Help',
      description:
        'Assistance with viewing and downloading bank statements.',
    },
  ]

  const filteredTopics = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return helpTopics
    }

    return helpTopics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query)
    )
  }, [searchTerm])

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
      !formData.name ||
      !formData.email ||
      !formData.issueType ||
      !formData.description
    ) {
      setError('Please complete all required fields.')
      return
    }

    setSuccess(
      'Your support request has been submitted successfully. Our customer service team will contact you.'
    )

    setFormData({
      name: '',
      email: '',
      accountNumber: '',
      issueType: '',
      description: '',
    })
  }

  return (
    <PageLayout
      title="Customer Service"
      subtitle="Find help and raise support requests for your banking needs."
      onLogout={onLogout}
    >
      {/* Search Help */}
      <div className="bank-panel">
        <h2 className="bank-section-title">
          Search Help
        </h2>

        <div className="bank-search-row">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search login, account, card, transaction, password..."
          />

          <button
            type="button"
            className="bank-button secondary"
            onClick={() => setSearchTerm('')}
            disabled={!searchTerm}
          >
            Clear
          </button>
        </div>

        <div className="bank-info-grid">
          {filteredTopics.map((topic) => (
            <div
              className="bank-info-card"
              key={topic.title}
            >
              <h3>{topic.title}</h3>

              <p>{topic.description}</p>
            </div>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="empty-state">
            No matching help topic found.
          </div>
        )}
      </div>

      {/* Contact Details */}
      <div
        className="bank-panel"
        style={{ marginTop: '24px' }}
      >
        <h2 className="bank-section-title">
          Customer Support
        </h2>

        <div className="bank-info-grid">

          <div className="bank-info-card">
            <h3>Customer Care</h3>
            <p>1800-123-4567</p>
          </div>

          <div className="bank-info-card">
            <h3>Email Support</h3>
            <p>support@onlinebanking.com</p>
          </div>

          <div className="bank-info-card">
            <h3>Working Hours</h3>
            <p>
              Monday - Saturday
              <br />
              9:00 AM - 6:00 PM
            </p>
          </div>

        </div>
      </div>

      {/* Complaint Form */}
      <div
        className="bank-panel"
        style={{ marginTop: '24px' }}
      >
        <h2 className="bank-section-title">
          Raise a Support Request
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
              <label htmlFor="name">
                Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
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
                placeholder="Enter your email"
              />
            </div>

            <div className="bank-field">
              <label htmlFor="accountNumber">
                Account Number
              </label>

              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
              />
            </div>

            <div className="bank-field">
              <label htmlFor="issueType">
                Issue Type *
              </label>

              <select
                id="issueType"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
              >
                <option value="">
                  Select issue
                </option>

                <option value="Login Issue">
                  Login Issue
                </option>

                <option value="Account Issue">
                  Account Issue
                </option>

                <option value="Card Issue">
                  Card Issue
                </option>

                <option value="Transaction Issue">
                  Transaction Issue
                </option>

                <option value="Password Issue">
                  Password Issue
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

          </div>

          <div
            className="bank-field"
            style={{ marginTop: '18px' }}
          >
            <label htmlFor="description">
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your issue..."
            />
          </div>

          <div className="bank-button-row">
            <button
              type="submit"
              className="bank-button"
            >
              Submit Request
            </button>

            <button
              type="button"
              className="bank-button secondary"
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  accountNumber: '',
                  issueType: '',
                  description: '',
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

export default CustomerService