import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // To redirect in case of login issues
import AdminNav from "./AdminNav"; // Import AdminNav component
import AdminHeader from "./AdminHeader"; // Import AdminHeader component

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to safely check for localStorage availability
  const isLocalStorageAvailable = () => {
    try {
      const testKey = "__test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isLocalStorageAvailable()) {
        setError("LocalStorage is not available in this context.");
        return;
      }

      const token = localStorage.getItem("access_token"); // Get token from localStorage
      if (!token) {
        setError("You need to be logged in to view users.");
        navigate("/login"); // Redirect to login if token is not found
        return;
      }

      try {
        const response = await fetch("https://phase4project-1.onrender.com/admin/users", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Include token in request headers
          },
        });

        if (!response.ok) {
          // Handle 401 unauthorized error (token might be invalid or expired)
          if (response.status === 401) {
            setError("Unauthorized: Please login again.");
            localStorage.removeItem("access_token"); // Clear expired or invalid token
            navigate("/login"); // Redirect to login page
          } else {
            setError("Failed to fetch users.");
          }
          return;
        }

        const data = await response.json();
        setUsers(data.users); // Assuming the API returns an object with a "users" field
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("An error occurred while fetching users.");
      }
    };

    fetchUsers();
  }, [navigate]); // Added navigate to the dependency array

  return (
    <div className="container">
      <AdminHeader /> {/* Admin Header */}
      <AdminNav /> {/* Admin Navigation */}
      
      <h2>Manage Users</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
