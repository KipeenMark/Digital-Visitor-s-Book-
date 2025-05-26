import { useState } from 'react'; // useState is a React hook for managing state in functional components

// const VisitorForm = () => { , (Component Declaration)  declares a functional component using arrow function syntax.
// usestate , initialize a form state object with multiple fields: formData : The state variable containing all form fields,setFormData :The function used to update the form state.
 
const VisitorForm = () => { 
  const [formData, setFormData] = useState({
    name: '', // for visitor's full name
    email: '', //for visitor's email address
    phone: '', // for visitor's phone number
    purpose: '', //for the purpose of the visit
    hostPerson: '', //for the name of the person being visited
    location: '', // New field for visitor's location
  });

  // async: keyword indicates this function handles asynchronous operations (like API calls)
  // setMessage: function to update the message state with success or error messages
  // e.preventDefault :stops the form from triggering a page reload
  // ... : is used to copy all form fields
  //toISOString() : converts the current date/time to a standardized format
  const [message, setMessage] = useState({ text: '', type: '' });

  const makeRequest = async (visitorData) => {
    const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${BASE_URL}/api/visitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(visitorData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const visitorData = {
        ...formData,
        timeIn: new Date().toISOString()
      };

      const data = await makeRequest(visitorData);
      setMessage({ text: 'Visitor checked in successfully!', type: 'success' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        purpose: '',
        hostPerson: '',
        location: '',
      });
    } catch (error) {
      setMessage({ text: error.message || 'Error connecting to server', type: 'error' });
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