import React, { useState, useEffect } from 'react';

const VisitorsList = () => {
  const today = new Date();
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(null);
  const [selectedDay, setSelectedDay] = useState(today.getDate().toString().padStart(2, '0'));
  const [selectedMonth, setSelectedMonth] = useState((today.getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(today.getFullYear().toString());
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'monthly'

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
      filterVisitors(
        today.getDate().toString().padStart(2, '0'),
        (today.getMonth() + 1).toString().padStart(2, '0'),
        today.getFullYear().toString(),
        data
      );
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

  const calculateDuration = (timeIn, timeOut) => {
    if (!timeIn || !timeOut) return '-';
    
    const start = new Date(timeIn);
    const end = new Date(timeOut);
    const diff = end - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
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

  const filterVisitors = (day, month, year, visitorsList = visitors) => {
    let filtered = [...visitorsList];

    if (viewMode === 'monthly' && month && year) {
      filtered = filtered.filter(visitor => {
        if (!visitor.timeIn) return false;
        
        const visitDate = new Date(visitor.timeIn);
        const visitMonth = (visitDate.getMonth() + 1).toString().padStart(2, '0');
        const visitYear = visitDate.getFullYear().toString();

        return visitMonth === month && visitYear === year;
      });
    } else if (day || month || year) {
      filtered = filtered.filter(visitor => {
        if (!visitor.timeIn) return false;
        
        const visitDate = new Date(visitor.timeIn);
        const visitDay = visitDate.getDate().toString().padStart(2, '0');
        const visitMonth = (visitDate.getMonth() + 1).toString().padStart(2, '0');
        const visitYear = visitDate.getFullYear().toString();

        const matchDay = !day || visitDay === day;
        const matchMonth = !month || visitMonth === month;
        const matchYear = !year || visitYear === year;

        return matchDay && matchMonth && matchYear;
      });
    }

    filtered.sort((a, b) => new Date(b.timeIn) - new Date(a.timeIn));
    setFilteredVisitors(filtered);
  };

  const resetFilters = () => {
    setSelectedDay(today.getDate().toString().padStart(2, '0'));
    setSelectedMonth((today.getMonth() + 1).toString().padStart(2, '0'));
    setSelectedYear(today.getFullYear().toString());
    filterVisitors(
      today.getDate().toString().padStart(2, '0'),
      (today.getMonth() + 1).toString().padStart(2, '0'),
      today.getFullYear().toString()
    );
  };

  if (loading) {
    return <div className="loading">Loading visitors...</div>;
  }

  return (
    <div className="table-container">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
            {viewMode === 'daily' ? "Today's Visitors List" : "Monthly Visitors List"}
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setViewMode('daily')}
              className={`btn ${viewMode === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{ padding: '0.5rem 1rem' }}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`btn ${viewMode === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{ padding: '0.5rem 1rem' }}
            >
              Monthly View
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <select
            value={selectedDay}
            onChange={(e) => {
              setSelectedDay(e.target.value);
              filterVisitors(e.target.value, selectedMonth, selectedYear);
            }}
            className="form-select"
            style={{ padding: '0.5rem' }}
          >
            {viewMode === 'daily' ? (
              <>
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day.toString().padStart(2, '0')}>
                    {day}
                  </option>
                ))}
              </>
            ) : (
              <option value="">All Days</option>
            )}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              filterVisitors(selectedDay, e.target.value, selectedYear);
            }}
            className="form-select"
            style={{ padding: '0.5rem' }}
          >
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month.toString().padStart(2, '0')}>
                {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              filterVisitors(selectedDay, selectedMonth, e.target.value);
            }}
            className="form-select"
            style={{ padding: '0.5rem' }}
          >
            <option value="">Year</option>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button 
            onClick={fetchVisitors} 
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            Refresh List
          </button>
          <button 
            onClick={resetFilters}
            className="btn btn-outline-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            {viewMode === 'daily' ? "Today's List" : "Current Month"}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ margin: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '0.375rem' }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        {filteredVisitors.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-500)' }}>
            No visitors found
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>From</th>
                <th>Contact</th>
                <th>Purpose & Host</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td>{visitor.name}</td>
                  <td>
                    <div style={{ color: 'var(--gray-700)' }}>{visitor.location}</div>
                  </td>
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
                  <td style={{
                    color: visitor.status === 'completed' ? 'var(--gray-700)' : '#10b981',
                    fontWeight: '500',
                    fontFamily: 'monospace'
                  }}>
                    {calculateDuration(visitor.timeIn, visitor.timeOut)}
                  </td>
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