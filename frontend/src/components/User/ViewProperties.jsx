// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import UserNav from './UserNav';

// const ViewProperty = () => {
//   const { id } = useParams();
//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`http://127.0.0.1:5000/property/${id}`)
//       .then(response => response.json())
//       .then(data => {
//         setProperty(data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching property details:', error);
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) {
//     return <p className="text-center">Loading...</p>;
//   }

//   if (!property) {
//     return <p className="text-center text-danger">Property not found.</p>;
//   }

//   return (
//     <div>
//       <UserNav />
//       <div className="container mt-4">
//         <h1 className="mb-4">{property.title}</h1>
//         <img src={property.image_url || 'https://via.placeholder.com/600'} alt={property.title} className="img-fluid rounded mb-4" />
//         <p className="fw-bold text-primary">${property.price}</p>
//         <p><strong>Location:</strong> {property.location}</p>
//         <p>{property.description}</p>
//       </div>
//     </div>
//   );
// };

// export default ViewProperty;
