// import React, { useState } from 'react';
// import AdminHeader from './AdminHeader';
// import AdminNav from './AdminNav';

// const AddAdmin = () => {
//   const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
//   const [message, setMessage] = useState(null);

//   const handleRegisterAdmin = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');

//     try {
//       const response = await fetch('http://127.0.0.1:5000/admin/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify(newAdmin),
//       });

//       if (response.ok) {
//         setMessage({ type: "success", text: "Admin registered successfully!" });
//         setNewAdmin({ name: "", email: "", password: "" });
//       } else {
//         setMessage({ type: "danger", text: "Failed to register admin." });
//       }
//     } catch {
//       setMessage({ type: "danger", text: "Server error. Please try again later." });
//     }
//   };

//   return (
//     <div className="container">
//       <AdminHeader />
//       <AdminNav />
//       <div className="admin-content">
//         <h3>Add New Admin</h3>

//         {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

//         <form onSubmit={handleRegisterAdmin} className="mb-4">
//           <input type="text" placeholder="Name" className="form-control mb-2" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} required />
//           <input type="email" placeholder="Email" className="form-control mb-2" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
//           <input type="password" placeholder="Password" className="form-control mb-2" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
//           <button className="btn btn-primary">Register Admin</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddAdmin;
