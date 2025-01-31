import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  return (
    <div>
      {/* Bootstrap Carousel (Image Slider) */}
      <div id="carouselExampleIndicators" className="carousel slide mt-3" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://png.pngtree.com/thumb_back/fh260/background/20230630/pngtree-d-hand-embracing-real-estate-homeownership-investing-mortgages-purchasing-offers-and-image_3691143.jpg" 
                 className="d-block mx-auto rounded" alt="House 1" 
                 style={{ width: '80%', height: '300px', objectFit: 'cover' }} />
          </div>
          <div className="carousel-item">
            <img src="https://i.pinimg.com/736x/93/e1/0e/93e10e06e28a305bbb1f9be260cec04f.jpg" 
                 className="d-block mx-auto rounded" alt="House 2" 
                 style={{ width: '80%', height: '300px', objectFit: 'cover' }} />
          </div>
          <div className="carousel-item">
            <img src="https://i.pinimg.com/736x/b4/b9/aa/b4b9aac0fd4a6efd448db56874b15326.jpg" 
                 className="d-block mx-auto rounded" alt="House 3" 
                 style={{ width: '80%', height: '300px', objectFit: 'cover' }} />
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      {/* About Us Section */}
      <section className="container my-5">
        <h2 className="text-center fw-bold">About Us</h2>
        <p className="text-muted text-center">
          At Sam Real Estate, we connect buyers with their dream homes. Whether you're looking for a 
          luxury property or an affordable home, we offer the best listings and expert guidance.
        </p>
      </section>

      {/* Property Listings */}
      <PropertyListings />
    </div>
  );
};

// Property Listings Component
const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/properties');
        const data = await response.json();

        // If API returns an array, set it directly
        if (Array.isArray(data)) {
          setProperties(data);
        } else if (data.properties) {
          setProperties(data.properties);
        } else {
          console.error('Unexpected API response:', data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyClick = () => {
    navigate('/login'); // Redirect to login first
  };

  return (
    <section className="container my-5">
      <h2 className="text-center fw-bold">Available Properties</h2>
      <div className="row">
        {properties.length > 0 ? (
          properties.map((property, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow-sm">
                <img 
                  src={property.image_url || 'https://via.placeholder.com/300'} 
                  className="card-img-top" 
                  alt={property.title} 
                  style={{ height: '200px', objectFit: 'cover' }} 
                />
                <div className="card-body">
                  <h5 className="card-title">{property.title}</h5>
                  <p className="card-text">{property.description}</p>
                  <p className="fw-bold text-primary">Ksh:{property.price}</p>
                  <p>Location: {property.location}</p>
                  <button className="btn btn-primary w-100" onClick={handlePropertyClick}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No properties available at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default Banner;
