import { useState } from 'react';

const VisitorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: '',
    hostPerson: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Will be implemented when we connect to backend
    console.log('Form submitted:', formData);
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
          Register Visit
        </button>
      </form>
    </div>
  );
};

export default VisitorForm;