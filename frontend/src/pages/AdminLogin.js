import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError(""); // Clear any previous errors

      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Required for CORS with authentication
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        setError("Invalid email or password. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Backend Response:", data);

      if (data && data.access_token) {
        localStorage.setItem("token", data.access_token); // Store token
        navigate("/admin-dashboard"); // Redirect to admin dashboard
      } else {
        setError("Invalid response format from the server");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
      {/* Navbar with Home link */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <a className="navbar-brand" href="/">Real Estate</a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="text-center mb-4">Admin Login</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              <form>
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                </div>
              </form>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
