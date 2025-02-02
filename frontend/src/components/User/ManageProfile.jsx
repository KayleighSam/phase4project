import React, { useEffect, useState } from "react";
import UserNav from "./UserNav";

const ManageProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    newPassword: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data from the backend
  useEffect(() => {
    // Retrieve the token from localStorage or a global state like context
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Please manage your profile .");
      return;
    }

    fetch("https://phase4project-1.onrender.com/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.name) {
          setUserInfo({
            name: data.name,
            email: data.email,
            role: data.role,
          });
        } else {
          alert("Failed to fetch user profile.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        alert("Failed to fetch user profile.");
      });
  }, []);

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handle form submission (update user profile)
  const handleSaveClick = () => {
    const { name, email, password, newPassword } = userInfo;

    // Retrieve the token from localStorage or context
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Please manage your profile.");
      return;
    }

    fetch("https://phase4project-1.onrender.com/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // Add token to headers
      },
      body: JSON.stringify({
        name,
        email,
        password,
        newPassword: newPassword || undefined, // Only send new password if provided
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert("Profile updated successfully!");
          setIsEditMode(false);
        } else {
          alert("Failed to update profile.");
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Error updating profile. Please try again.");
      });
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
  };

  return (
    <div>
      <UserNav />
      <div className="container mt-4">
        <h2>Manage Profile</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="card mt-4">
          <div className="card-header">
            <h5>User Profile</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-3">
                <strong>Name:</strong>
              </div>
              <div className="col-md-9">
                {isEditMode ? (
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={userInfo.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userInfo.name}</p>
                )}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">
                <strong>Email:</strong>
              </div>
              <div className="col-md-9">
                {isEditMode ? (
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userInfo.email}</p>
                )}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">
                <strong>Role:</strong>
              </div>
              <div className="col-md-9">
                <p>{userInfo.role}</p>
              </div>
            </div>
            {isEditMode && (
              <>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <strong>New Password:</strong>
                  </div>
                  <div className="col-md-9">
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={userInfo.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <strong>Current Password:</strong>
                  </div>
                  <div className="col-md-9">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={userInfo.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="row">
              {isEditMode ? (
                <>
                  <button className="btn btn-success me-2" onClick={handleSaveClick}>
                    Save Changes
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancelClick}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={handleEditClick}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;
