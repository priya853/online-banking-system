import { useState } from 'react'
import AdminPageLayout from './AdminPageLayout'
import './AddBank.css'

function AddBank({ onLogout }) {
  const [form, setForm] = useState({
    bankName: '',
    bankCode: '',
    ifscCode: '',
    branchName: '',
    branchAddress: '',
    contactNumber: '',
    email: '',
    status: 'Active',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setMessage('')
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    setMessage('')
    setError('')

    const requiredFields = [
      'bankName',
      'bankCode',
      'ifscCode',
      'branchName',
      'branchAddress',
      'contactNumber',
      'email',
    ]

    const hasEmptyField = requiredFields.some(
      (field) => !form[field].trim()
    )

    if (hasEmptyField) {
      setError('Please fill in all required fields.')
      return
    }

    setMessage('Bank details submitted successfully.')

    setForm({
      bankName: '',
      bankCode: '',
      ifscCode: '',
      branchName: '',
      branchAddress: '',
      contactNumber: '',
      email: '',
      status: 'Active',
    })
  }

  function handleClear() {
    setForm({
      bankName: '',
      bankCode: '',
      ifscCode: '',
      branchName: '',
      branchAddress: '',
      contactNumber: '',
      email: '',
      status: 'Active',
    })

    setMessage('')
    setError('')
  }

  return (
    <AdminPageLayout
      title="Add Bank"
      subtitle="Register a new bank and branch."
      onLogout={onLogout}
    >
      <div className="add-bank-content">

        <div className="add-bank-header">
          <div>
            <span className="add-bank-eyebrow">
              BANK ADMINISTRATION
            </span>

            <h2>Bank Registration</h2>

            <p>
              Enter bank and branch information for administrative records.
            </p>
          </div>

          <div className="add-bank-badge">
            Admin Access
          </div>
        </div>

        <div className="add-bank-card">

          <div className="add-bank-card-heading">
            <span>BANK INFORMATION</span>
            <h3>Add New Bank</h3>
            <p>
              Complete all required details before submitting the form.
            </p>
          </div>

          {message && (
            <div className="add-bank-message add-bank-success">
              <strong>Submission Successful</strong>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="add-bank-message add-bank-error">
              <strong>Validation Error</strong>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="add-bank-grid">

              <div className="add-bank-field">
                <label htmlFor="bankName">Bank Name</label>
                <input
                  id="bankName"
                  name="bankName"
                  type="text"
                  placeholder="Enter bank name"
                  value={form.bankName}
                  onChange={handleChange}
                />
              </div>

              <div className="add-bank-field">
                <label htmlFor="bankCode">Bank Code</label>
                <input
                  id="bankCode"
                  name="bankCode"
                  type="text"
                  placeholder="Enter bank code"
                  value={form.bankCode}
                  onChange={handleChange}
                />
              </div>

              <div className="add-bank-field">
                <label htmlFor="ifscCode">IFSC Code</label>
                <input
                  id="ifscCode"
                  name="ifscCode"
                  type="text"
                  placeholder="Enter IFSC code"
                  value={form.ifscCode}
                  onChange={handleChange}
                />
              </div>

              <div className="add-bank-field">
                <label htmlFor="branchName">Branch Name</label>
                <input
                  id="branchName"
                  name="branchName"
                  type="text"
                  placeholder="Enter branch name"
                  value={form.branchName}
                  onChange={handleChange}
                />
              </div>

              <div className="add-bank-field">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  placeholder="Enter contact number"
                  value={form.contactNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="add-bank-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter bank email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="add-bank-field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>

            <div className="add-bank-field add-bank-address-field">
              <label htmlFor="branchAddress">
                Branch Address
              </label>

              <textarea
                id="branchAddress"
                name="branchAddress"
                rows="4"
                placeholder="Enter complete branch address"
                value={form.branchAddress}
                onChange={handleChange}
              />
            </div>

            <div className="add-bank-actions">
              <button
                type="submit"
                className="add-bank-primary"
              >
                Add Bank
              </button>

              <button
                type="button"
                className="add-bank-secondary"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>

          </form>

          <div className="add-bank-note">
            <strong>Bank Information</strong>
            <p>
              Keep bank, branch and contact information accurate for
              administrative reference.
            </p>
          </div>

        </div>
      </div>
    </AdminPageLayout>
  )
}

export default AddBank