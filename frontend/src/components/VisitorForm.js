import { useState } from 'react';

const VisitorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: '',
    hostPerson: '',
    location: '', // New field for visitor's location
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const visitorData = {
        ...formData,
        timeIn: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/api/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitorData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: 'Visitor checked in successfully!', type: 'success' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          purpose: '',
          hostPerson: '',
          location: '',
        });
      } else {
        setMessage({ text: data.error || 'Failed to register visitor', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error connecting to server', type: 'error' });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="form-container">
      <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Register New Visitor</h2>
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Where are you from?</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Company, Organization, or City"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Purpose of Visit</label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows="3"
            className="form-input"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Person to Visit</label>
          <input
            type="text"
            name="hostPerson"
            value={formData.hostPerson}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Check In Visitor
        </button>
      </form>
    </div>
  );
};

export default VisitorForm;