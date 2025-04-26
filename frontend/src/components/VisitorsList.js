import { useState, useEffect } from 'react';

const VisitorsList = () => {
  const [visitors, setVisitors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(null);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/visitors');
      if (!response.ok) {
        throw new Error('Failed to fetch visitors');
      }
      const data = await response.json();
      setVisitors(data);
      setError('');
    } catch (err) {
      setError('Error loading visitors. Please try again later.');
      console.error('Error fetching visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (visitorId) => {
    if (!visitorId) {
      console.error('No visitor ID provided for checkout');
      return;
    }
    
    setCheckingOut(visitorId);
    try {
      const response = await fetch(`http://localhost:5000/api/visitors/${visitorId}/checkout`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to checkout visitor');
      }
      
      // Refresh the visitors list
      await fetchVisitors();
      setError('');
    } catch (err) {
      setError('Error checking out visitor. Please try again.');
      console.error('Error:', err);
    } finally {
      setCheckingOut(null);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
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

  if (loading) {
    return <div className="loading">Loading visitors...</div>;
  }

  return (
    <div className="table-container">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Visitors List</h2>
        <button 
          onClick={fetchVisitors} 
          className="btn btn-secondary"
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          Refresh List
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ margin: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '0.375rem' }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        {visitors.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-500)' }}>
            No visitors found
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Contact</th>
                <th>Purpose & Host</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td>{visitor.name}</td>
                  <td>
                    <div>{visitor.email}</div>
                    <div style={{ color: 'var(--gray-700)', fontSize: '0.875rem' }}>{visitor.phone}</div>
                  </td>
                  <td>
                    <div>{visitor.purpose}</div>
                    <div style={{ color: 'var(--gray-700)', fontSize: '0.875rem' }}>{visitor.hostPerson}</div>
                  </td>
                  <td>{formatDateTime(visitor.timeIn)}</td>
                  <td>{formatDateTime(visitor.timeOut)}</td>
                  <td>{getStatusBadge(visitor.status)}</td>
                  <td>
                    {visitor.status === 'active' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleCheckout(visitor._id)}
                        disabled={checkingOut === visitor._id}
                        style={{ padding: '0.25rem 0.75rem' }}
                      >
                        {checkingOut === visitor._id ? 'Checking Out...' : 'Check Out'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VisitorsList;