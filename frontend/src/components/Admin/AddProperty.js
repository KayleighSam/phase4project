import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminNav from './AdminNav';

const AddProperty = () => {
  const [property, setProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: '',
    availability_status: '',
    image_url: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setProperty({
      ...property,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');  // Assuming JWT is stored in localStorage

    try {
      const response = await fetch('https://phase4project-1.onrender.com/property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(property),
      });

      if (response.ok) {
        setSuccess('Property added successfully!');
        setError(null);
        setProperty({
          title: '',
          description: '',
          price: '',
          location: '',
          type: '',
          availability_status: '',
          image_url: ''
        });
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred');
        setSuccess('');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      setSuccess('');
    }
  };

  return (
    <div className="container">
      <AdminHeader />
      <AdminNav />
      <div className="admin-content">
        <h3 className="mb-4 text-center">Add Property</h3>
        <p className="mb-4 text-center">Fill out the form below to add a new property.</p>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="mb-4">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={property.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={property.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  value={property.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={property.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="type" className="form-label">Property Type</label>
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={property.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Property Type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                  <option value="Land">Land</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="availability_status" className="form-label">Availability Status</label>
                <select
                  className="form-select"
                  id="availability_status"
                  name="availability_status"
                  value={property.availability_status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="image_url" className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  id="image_url"
                  name="image_url"
                  value={property.image_url}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">Add Property</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
