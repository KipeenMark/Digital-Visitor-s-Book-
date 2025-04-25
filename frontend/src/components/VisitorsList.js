import { useState } from 'react';

const VisitorsList = () => {
  // This will be replaced with actual data from backend
  const [visitors] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      purpose: "Meeting with HR",
      hostPerson: "Jane Smith",
      checkIn: "2024-04-25T10:00:00",
      checkOut: "2024-04-25T11:30:00",
      status: "completed"
    },
    {
      id: 2,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "098-765-4321",
      purpose: "Interview",
      hostPerson: "Bob Wilson",
      checkIn: "2024-04-25T14:00:00",
      checkOut: null,
      status: "active"
    }
  ]);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const style = {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '500',
      display: 'inline-block'
    };

    if (status === 'active') {
      return (
        <span style={{ ...style, backgroundColor: '#dcfce7', color: '#166534' }}>
          Active
        </span>
      );
    }
    return (
      <span style={{ ...style, backgroundColor: '#f3f4f6', color: '#374151' }}>
        Completed
      </span>
    );
  };

  return (
    <div className="table-container">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Visitors List</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Visitor</th>
              <th>Contact</th>
              <th>Purpose & Host</th>
              <th>Check In/Out</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => (
              <tr key={visitor.id}>
                <td>{visitor.name}</td>
                <td>
                  <div>{visitor.email}</div>
                  <div style={{ color: 'var(--gray-700)', fontSize: '0.875rem' }}>{visitor.phone}</div>
                </td>
                <td>
                  <div>{visitor.purpose}</div>
                  <div style={{ color: 'var(--gray-700)', fontSize: '0.875rem' }}>{visitor.hostPerson}</div>
                </td>
                <td>
                  <div>In: {formatDateTime(visitor.checkIn)}</div>
                  {visitor.checkOut && (
                    <div style={{ color: 'var(--gray-700)', fontSize: '0.875rem' }}>
                      Out: {formatDateTime(visitor.checkOut)}
                    </div>
                  )}
                </td>
                <td>
                  {getStatusBadge(visitor.status)}
                </td>
                <td>
                  {!visitor.checkOut && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => console.log('Checkout visitor:', visitor.id)}
                      style={{ padding: '0.25rem 0.75rem' }}
                    >
                      Check Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorsList;