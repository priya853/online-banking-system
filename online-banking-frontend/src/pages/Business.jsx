import PageLayout from './PageLayout'

function Business() {
  const services = [
    {
      title: 'Business Account',
      description:
        'Banking solutions for daily business operations.',
    },
    {
      title: 'Working Capital',
      description:
        'Financial support for short-term business requirements.',
    },
    {
      title: 'Business Loans',
      description:
        'Funding options for expansion and business growth.',
    },
    {
      title: 'Merchant Payments',
      description:
        'Accept and manage digital business payments.',
    },
    {
      title: 'Cash Management',
      description:
        'Manage business cash flow and account activity.',
    },
    {
      title: 'Business Support',
      description:
        'Dedicated assistance for business banking needs.',
    },
  ]

  return (
    <PageLayout
      title="Business Banking"
      subtitle="Banking services for growing businesses and entrepreneurs."
    >
      <div className="bank-info-grid">
        {services.map((service) => (
          <div className="bank-info-card" key={service.title}>
            <h3>{service.title}</h3>

            <p>{service.description}</p>

            <div className="bank-button-row">
              <button
                type="button"
                className="bank-button"
                onClick={() =>
                  alert(
                    `${service.title} service selected.`
                  )
                }
              >
                View Service
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export default Business