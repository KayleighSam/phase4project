import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProperty = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', description: '', price: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`https://phase4project-1.onrender.com/admin/properties/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setFormData(response.data.property);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://https://phase4project-1.onrender.com/admin/properties/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      navigate('/admin/manage-properties');
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="card p-4">
      <h3>Edit Property</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Property</button>
      </form>
    </div>
  );
};

export default EditProperty;
