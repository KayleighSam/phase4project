import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientLogin = () => {
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
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        setError("Invalid email or password. Please try again.");
        toast.error("Invalid email or password. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Backend Response:", data);

      if (data && data.access_token) {
        localStorage.setItem("token", data.access_token);
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 1000);
      } else {
        setError("Invalid response format from the server");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Something went wrong. Please try again later.");
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
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
              <h1 className="text-center mb-4">Client Login</h1>
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

              <div className="mt-3 text-center">
                <p>
                  Don't have an account?{" "}
                  <a href="/signup" className="text-primary">
                    Sign up here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toastify container for displaying toasts */}
      <ToastContainer />
    </div>
  );
};

export default ClientLogin;
