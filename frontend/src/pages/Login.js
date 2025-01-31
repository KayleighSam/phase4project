// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Use for redirecting
// import { NavLink } from 'react-router-dom'; // For signup link

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // Handle login
//   const handleLogin = async () => {
//     try {
//       setError(''); // Clear previous errors

//       // Sending login request to the backend
//       const response = await fetch('http://127.0.0.1:5000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//         credentials: 'include', // Ensure credentials are included for session management
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setError('Invalid email or password. Please try again.');
//         console.error('Backend Error:', errorData);
//         return;
//       }

//       // Parse the response JSON
//       const data = await response.json();
//       console.log('Backend Response:', data);

//       // Check if response contains an access_token (assuming backend uses JWT)
//       if (data && data.access_token) {
//         // Store the token in localStorage
//         localStorage.setItem('token', data.access_token);

//         // After login success, redirect to user dashboard
//         navigate('/user-dashboard');
//       } else {
//         setError('Invalid response format from the server');
//       }
//     } catch (error) {
//       console.error('Error logging in:', error);
//       setError('Something went wrong. Please try again later.');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card shadow">
//             <div className="card-body">
//               <h1 className="text-center mb-4">User Login</h1>
//               {error && (
//                 <div className="alert alert-danger" role="alert">
//                   {error}
//                 </div>
//               )}
//               <form>
//                 {/* Email field */}
//                 <div className="form-group mb-3">
//                   <label htmlFor="email">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>

//                 {/* Password field */}
//                 <div className="form-group mb-3">
//                   <label htmlFor="password">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>

//                 {/* Submit button */}
//                 <div className="d-grid">
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={handleLogin}
//                   >
//                     Login
//                   </button>
//                 </div>
//               </form>

//               <div className="mt-3 text-center">
//                 <p>
//                   Don't have an account?{' '}
//                   <NavLink to="/signup" className="text-primary">
//                     Sign up here
//                   </NavLink>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
