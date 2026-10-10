import { useNavigate } from 'react-router-dom'
import aboutBankImage from '../assets/about-bank.png'
import './AboutUs.css'

function AboutUs() {
  const navigate = useNavigate()

  return (
    <div className="public-bank-page">

      {/* ================= HEADER ================= */}
      <header className="public-bank-header">

        <div className="public-bank-header-inner">

          <div className="public-bank-logo">
            <span className="public-bank-logo-icon">
              🏦
            </span>

            <span className="public-bank-logo-text">
              Online Banking
            </span>
          </div>

          <nav className="public-bank-nav">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#corporate">Corporate</a>
            <a href="#service">Customer Service</a>
            <a href="#contact">Contact Us</a>
          </nav>

          <div className="public-bank-auth">
            <button
              type="button"
              className="public-login-button"
              onClick={() => navigate('/login')}
            >
              Login
            </button>

            <button
              type="button"
              className="public-register-button"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>

        </div>

      </header>

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="public-bank-hero"
        style={{
          backgroundImage: `url(${aboutBankImage})`,
        }}
      >
        <div className="public-bank-hero-overlay">

          <div className="public-bank-hero-content">

            <span className="public-bank-small-title">
              WELCOME TO ONLINE BANKING
            </span>

            <h1>
              Your Money.
              <br />
              Your Goals. Our Commitment.
            </h1>

            <p>
              Secure, simple and reliable banking
              designed for your everyday financial needs.
            </p>

            <div className="public-bank-hero-buttons">

              <button
                type="button"
                className="public-hero-login"
                onClick={() => navigate('/login')}
              >
                Login
              </button>

              <button
                type="button"
                className="public-hero-register"
                onClick={() => navigate('/register')}
              >
                Register
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="public-bank-section"
      >

        <div className="public-bank-section-heading">
          <span>ABOUT US</span>

          <h2>
            Banking Built on Trust
          </h2>

          <p>
            We combine trusted banking practices with
            modern technology to provide a convenient
            and secure digital banking experience.
          </p>
        </div>

        <div className="public-about-grid">

          <div className="public-about-text">

            <h3>
              Our Story
            </h3>

            <p>
              Our goal is to make banking simple,
              transparent and accessible for individuals,
              families and businesses.
            </p>

            <p>
              Through digital banking services, secure
              transactions and customer-focused support,
              we help customers manage their finances
              with confidence.
            </p>

            <div className="public-about-points">

              <div>
                <strong>Secure Banking</strong>
                <span>
                  Protected access and secure transactions.
                </span>
              </div>

              <div>
                <strong>Digital Convenience</strong>
                <span>
                  Manage banking services anytime, anywhere.
                </span>
              </div>

              <div>
                <strong>Customer First</strong>
                <span>
                  Support focused on your banking needs.
                </span>
              </div>

            </div>

          </div>

          <div className="public-about-image">

            <img
              src={aboutBankImage}
              alt="Modern banking"
            />

          </div>

        </div>

      </section>

      {/* ================= SERVICES ================= */}
      <section
        id="corporate"
        className="public-bank-services"
      >

        <div className="public-bank-section-heading">
          <span>OUR SERVICES</span>

          <h2>
            Banking Solutions for Every Need
          </h2>
        </div>

        <div className="public-service-grid">

          <div className="public-service-card">
            <div className="public-service-icon">
              👤
            </div>

            <h3>
              Personal Banking
            </h3>

            <p>
              Savings, accounts, transactions and
              everyday banking services.
            </p>
          </div>

          <div className="public-service-card">
            <div className="public-service-icon">
              🏢
            </div>

            <h3>
              Corporate Banking
            </h3>

            <p>
              Financial solutions designed for
              businesses and organizations.
            </p>
          </div>

          <div className="public-service-card">
            <div className="public-service-icon">
              💳
            </div>

            <h3>
              Cards
            </h3>

            <p>
              Convenient card solutions for
              everyday payments.
            </p>
          </div>

          <div className="public-service-card">
            <div className="public-service-icon">
              💰
            </div>

            <h3>
              Loans
            </h3>

            <p>
              Flexible financing solutions for
              personal and business requirements.
            </p>
          </div>

        </div>

      </section>

      {/* ================= SUPPORT ================= */}
      <section
        id="service"
        className="public-support-section"
      >

        <div className="public-support-content">

          <div>
            <span>
              CUSTOMER SERVICE
            </span>

            <h2>
              We're Here When You Need Us
            </h2>

            <p>
              Get assistance with your accounts,
              transactions, cards, passwords and
              other banking requirements.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="public-support-button"
          >
            Customer Service
          </button>

        </div>

      </section>

      {/* ================= CONTACT ================= */}
      <section
        id="contact"
        className="public-contact-section"
      >

        <div className="public-bank-section-heading">

          <span>
            CONTACT US
          </span>

          <h2>
            We're Always Ready to Help
          </h2>

        </div>

        <div className="public-contact-grid">

          <div>
            <strong>
              Customer Care
            </strong>

            <span>
              1800-123-4567
            </span>
          </div>

          <div>
            <strong>
              Email
            </strong>

            <span>
              support@onlinebanking.com
            </span>
          </div>

          <div>
            <strong>
              Head Office
            </strong>

            <span>
              Mumbai, Maharashtra
            </span>
          </div>

          <div>
            <strong>
              Working Hours
            </strong>

            <span>
              Monday - Saturday
              <br />
              9:00 AM - 6:00 PM
            </span>
          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="public-bank-footer">

        <div className="public-bank-footer-inner">

          <div>
            <strong>
              🏦 Online Banking
            </strong>

            <p>
              Secure banking for a better financial future.
            </p>
          </div>

          <div>
            <p>
              © 2026 Online Banking.
              All rights reserved.
            </p>
          </div>

        </div>

      </footer>

    </div>
  )
}

export default AboutUs