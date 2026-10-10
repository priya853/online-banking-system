import PageLayout from './PageLayout'

function Loans() {
  const loans = [
    {
      name: 'Personal Loan',
      amount: 'Up to ₹10,00,000',
      purpose: 'Personal expenses and emergency needs',
      rate: 'Starting from 10.5%',
    },
    {
      name: 'Home Loan',
      amount: 'Up to ₹50,00,000',
      purpose: 'Purchase or construction of a home',
      rate: 'Starting from 8.5%',
    },
    {
      name: 'Car Loan',
      amount: 'Up to ₹25,00,000',
      purpose: 'Purchase of new or used vehicle',
      rate: 'Starting from 9.0%',
    },
    {
      name: 'Education Loan',
      amount: 'Up to ₹20,00,000',
      purpose: 'Higher education expenses',
      rate: 'Starting from 8.0%',
    },
    {
      name: 'Business Loan',
      amount: 'Up to ₹30,00,000',
      purpose: 'Business expansion and working capital',
      rate: 'Starting from 11.0%',
    },
    {
      name: 'Corporate Loan',
      amount: 'Custom Limit',
      purpose: 'Corporate financial requirements',
      rate: 'Rate based on eligibility',
    },
  ]

  return (
    <PageLayout
      title="Loans"
      subtitle="Explore loan products offered by Online Banking."
    >
      <div className="bank-info-grid">
        {loans.map((loan) => (
          <div className="bank-info-card" key={loan.name}>
            <h3>{loan.name}</h3>

            <p>
              <strong>Loan Amount:</strong> {loan.amount}
            </p>

            <p>
              <strong>Purpose:</strong> {loan.purpose}
            </p>

            <p>
              <strong>Interest:</strong> {loan.rate}
            </p>

            <div className="bank-button-row">
              <button
                type="button"
                className="bank-button"
                onClick={() =>
                  alert(
                    `${loan.name} application will be connected to backend later.`
                  )
                }
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export default Loans