import AdminPageLayout from './AdminPageLayout'

function ViewBanks({ onLogout }) {
  const banks = [
    {
      id: 1,
      bankName: 'FinBank',
      bankCode: 'FB001',
      ifscCode: 'FINB0001001',
      branchName: 'Kalyan Main Branch',
      contactNumber: '1800-123-4567',
      email: 'support@finbank.com',
      status: 'Active',
    },
    {
      id: 2,
      bankName: 'FinBank',
      bankCode: 'FB002',
      ifscCode: 'FINB0001002',
      branchName: 'Thane Branch',
      contactNumber: '1800-123-4567',
      email: 'thane@finbank.com',
      status: 'Active',
    },
  ]

  return (
    <AdminPageLayout
      title="View Banks"
      subtitle="View all registered banks and branches."
      onLogout={onLogout}
    >
      <div className="bank-panel">
        <h2 className="bank-section-title">
          Registered Banks
        </h2>

        <div className="bank-table-wrapper">
          <table className="bank-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Bank Name</th>
                <th>Bank Code</th>
                <th>IFSC Code</th>
                <th>Branch</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {banks.map((bank, index) => (
                <tr key={bank.id}>
                  <td>{index + 1}</td>
                  <td>{bank.bankName}</td>
                  <td>{bank.bankCode}</td>
                  <td>{bank.ifscCode}</td>
                  <td>{bank.branchName}</td>
                  <td>{bank.contactNumber}</td>
                  <td>{bank.email}</td>
                  <td>
                    <span
                      className={`bank-status ${
                        bank.status === 'Active'
                          ? 'active'
                          : 'blocked'
                      }`}
                    >
                      {bank.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageLayout>
  )
}

export default ViewBanks