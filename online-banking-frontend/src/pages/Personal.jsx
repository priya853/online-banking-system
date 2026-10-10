import PageLayout from './PageLayout'

function Personal() {
  const services = [
    {
      title: 'Savings Account',
      description:
        'Manage your savings and everyday banking requirements.',
    },
    {
      title: 'Fixed Deposit',
      description:
        'Grow your savings with fixed-term deposit options.',
    },
    {
      title: 'Recurring Deposit',
      description:
        'Build your savings gradually through regular deposits.',
    },
    {
      title: 'Digital Banking',
      description:
        'Access banking services securely from anywhere.',
    },
    {
      title: 'Money Transfer',
      description:
        'Transfer funds securely between eligible accounts.',
    },
    {
      title: 'Bill Payments',
      description:
        'Manage regular bills and payment requirements.',
    },
  ]

  return (
    <PageLayout
      title="Personal Banking"
      subtitle="Banking solutions designed for your everyday financial needs."
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

export default Personal