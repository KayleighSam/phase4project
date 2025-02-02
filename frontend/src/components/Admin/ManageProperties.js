import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminNav from './AdminNav';
import { FaTrashAlt, FaEdit } from 'react-icons/fa'; // Importing icons for delete and edit

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProperty, setEditingProperty] = useState(null); // Holds property being edited

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/properties', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties);
        setFilteredProperties(data.properties);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to load properties');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  // Handle search filtering
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = properties.filter(property =>
      property.title.toLowerCase().includes(term) ||
      property.description.toLowerCase().includes(term) ||
      property.location.toLowerCase().includes(term)
    );

    setFilteredProperties(filtered);
  };

  // Handle delete property
  const handleDelete = async (propertyId) => {
    if (!propertyId) {
      setError("Property ID is missing.");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/property/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`, // Include JWT token for authentication
        },
      });

      if (response.ok) {
        setProperties(properties.filter(property => property.property_id !== propertyId));
        setFilteredProperties(filteredProperties.filter(property => property.property_id !== propertyId));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete property.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  // Handle edit property
  const handleEdit = (property) => {
    setEditingProperty({ ...property });
  };

  // Handle update property
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:5000/property/${editingProperty.property_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProperty),
      });

      if (response.ok) {
        setEditingProperty(null);
        fetchProperties(); // Reload property list
      } else {
        setError("Failed to update property.");
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="container">
      <AdminHeader />
      <AdminNav />
      <div className="admin-content">
        <h3 className="mb-4">Manage Properties</h3>
        
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Add Property Link */}
        <div className="mb-3">
          <Link to="/admin-dashboard/add-property" className="btn btn-primary">
            Add Property
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search properties by title, location, or description"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Property Table */}
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-4">
            <thead>
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Price</th>
                <th scope="col">Location</th>
                <th scope="col">Type</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <tr key={property.property_id}>
                    <td>
                      {property.image_url ? (
                        <img src={property.image_url} alt={property.title} className="img-fluid" style={{ maxWidth: '100px' }} />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>{property.title}</td>
                    <td>{property.description}</td>
                    <td>${property.price}</td>
                    <td>{property.location}</td>
                    <td>{property.type}</td>
                    <td>{property.availability_status}</td>
                    <td>
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(property)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(property.property_id)}>
                        <FaTrashAlt /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No properties found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Property Form */}
        {editingProperty && (
          <div className="mt-5">
            <h4>Edit Property</h4>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProperty.title}
                  onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={editingProperty.description}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={editingProperty.price}
                  onChange={(e) => setEditingProperty({ ...editingProperty, price: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProperty.location}
                  onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success">Update Property</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingProperty(null)}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProperties;
