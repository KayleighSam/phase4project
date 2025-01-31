// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ViewListings = () => {
//   const [listings, setListings] = useState([]);

//   useEffect(() => {
//     const fetchListings = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/properties');
//         setListings(response.data.properties);
//       } catch (error) {
//         console.error(error.response.data.message);
//       }
//     };

//     fetchListings();
//   }, []);

//   return (
//     <div className="card p-4">
//       <h3>Available Listings</h3>
//       <div className="row">
//         {listings.map((listing) => (
//           <div className="col-md-4 mb-4" key={listing.id}>
//             <div className="card">
//               <div className="card-body">
//                 <h5 className="card-title">{listing.title}</h5>
//                 <p className="card-text">{listing.description}</p>
//                 <p className="card-text">Price: ${listing.price}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ViewListings;
