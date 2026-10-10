import { useState } from 'react'
import PageLayout from './PageLayout'

function ContactUs({ onLogout }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setError('Please fill in all required fields.')
      return
    }

    setSuccess(
      'Your message has been submitted successfully. Our team will contact you shortly.'
    )

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })
  }

  return (
    <PageLayout
      title="Contact Us"
      subtitle="We are here to help with your banking needs."
      onLogout={onLogout}
    >
      {/* Contact Information */}
      <div className="bank-panel">

        <h2 className="bank-section-title">
          Contact Information
        </h2>

        <div className="bank-info-grid">

          <div className="bank-info-card">
            <h3>Customer Care</h3>

            <p>
              1800-123-4567
            </p>

            <p>
              Available for banking assistance.
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Email</h3>

            <p>
              support@onlinebanking.com
            </p>

            <p>
              Send us your questions and feedback.
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Head Office</h3>

            <p>
              Mumbai, Maharashtra
            </p>

            <p>
              India
            </p>
          </div>

          <div className="bank-info-card">
            <h3>Working Hours</h3>

            <p>
              Monday - Saturday
            </p>

            <p>
              9:00 AM - 6:00 PM
            </p>
          </div>

        </div>
      </div>

      {/* Contact Form */}
      <div
        className="bank-panel"
        style={{ marginTop: '24px' }}
      >

        <h2 className="bank-section-title">
          Send Us a Message
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
              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="bank-field">
              <label htmlFor="subject">
                Subject *
              </label>

              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
              />
            </div>

          </div>

          <div
            className="bank-field"
            style={{ marginTop: '18px' }}
          >
            <label htmlFor="message">
              Message *
            </label>

            <textarea
              id="message"
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
            />
          </div>

          <div className="bank-button-row">

            <button
              type="submit"
              className="bank-button"
            >
              Send Message
            </button>

            <button
              type="button"
              className="bank-button secondary"
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  subject: '',
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

export default ContactUs