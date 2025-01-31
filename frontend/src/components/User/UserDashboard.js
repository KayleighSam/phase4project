import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import UserNav from "./UserNav";

const UserDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState(""); // Set empty initially
  const [authToken, setAuthToken] = useState(localStorage.getItem("token")); // Retrieve JWT token from localStorage
  const [phoneNumber, setPhoneNumber] = useState(""); // Phone number state for booking
  const [userFullName, setUserFullName] = useState(""); // User full name for booking

  useEffect(() => {
    // Fetch the current user's info if there's an auth token
    if (authToken) {
      fetch("http://127.0.0.1:5000/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
        credentials: "include", // Ensure credentials are included in the request
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.name) {
            setUserName(data.name);
            setUserFullName(data.name); // Save user's full name for booking
          } else {
            console.error("Failed to fetch user profile");
          }
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    }

    // Fetch property listings
    fetch("http://127.0.0.1:5000/properties", {
      credentials: "include", // Include credentials in the request
    })
      .then((response) => response.json())
      .then((data) => {
        setProperties(data.properties);
        setFilteredProperties(data.properties);
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }, [authToken]);

  const handleViewClick = (property) => {
    setSelectedProperty(property);
    setShowViewModal(true);
  };

  const handleBookClick = (property) => {
    setSelectedProperty(property);
    setShowBookModal(true);
  };

  const handleCloseViewModal = () => setShowViewModal(false);
  const handleCloseBookModal = () => setShowBookModal(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const filtered = properties.filter((property) =>
      property.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  const handleConfirmBooking = () => {
    const bookingData = {
      user_name: userFullName,  // Include full name in the booking
      property_id: selectedProperty.property_id,
      phone_number: phoneNumber, // Use phone number state
    };

    fetch("http://127.0.0.1:5000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify(bookingData),
      credentials: "include", // Ensure credentials are included in the request
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Booking created successfully") {
          alert("Booking confirmed!");
          handleCloseBookModal();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((error) => console.error("Error making booking:", error));
  };

  return (
    <div>
      {/* User Navigation */}
      <UserNav />

      {/* Welcome Section */}
      <div className="container mt-4">
        <div className="alert alert-primary text-center">
          <h2>Welcome, {userName || "User"}!</h2>
          <h4>Book with us for the best properties available!</h4>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mt-4">
        <h1 className="mb-4">Available Properties</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by property title..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="row">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div className="col-md-4 mb-4" key={property.property_id}>
                <div className="card shadow-sm">
                  <img
                    src={property.image_url || "https://via.placeholder.com/600x400?text=Property+Image"}
                    className="card-img-top"
                    alt={property.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{property.title}</h5>
                    <p className="fw-bold text-primary">Ksh:{property.price}</p>
                    <p>Location: {property.location}</p>
                    <div className="d-flex justify-content-between">
                      <button
                        onClick={() => handleViewClick(property)}
                        className="btn btn-primary w-48"
                      >
                        <FaEye className="me-2" /> View Property
                      </button>
                      <button
                        onClick={() => handleBookClick(property)}
                        className="btn btn-success w-48"
                      >
                        <FaEye className="me-2" /> Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">
              No properties available at the moment.
            </p>
          )}
        </div>
      </div>

      {/* View Property Modal */}
      <div
        className={`modal fade ${showViewModal ? "show" : ""}`}
        style={{ display: showViewModal ? "block" : "none" }}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedProperty?.title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseViewModal}
              ></button>
            </div>
            <div className="modal-body">
              <img
                src={selectedProperty?.image_url || "https://via.placeholder.com/600x400?text=Property+Image"}
                alt={selectedProperty?.title}
                className="img-fluid rounded mb-4"
              />
              <p>
                <strong>Price:</strong> ${selectedProperty?.price}
              </p>
              <p>
                <strong>Location:</strong> {selectedProperty?.location}
              </p>
              <p>
                <strong>Description:</strong> {selectedProperty?.description}
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseViewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Book Property Modal */}
      <div
        className={`modal fade ${showBookModal ? "show" : ""}`}
        style={{ display: showBookModal ? "block" : "none" }}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Book {selectedProperty?.title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseBookModal}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="formName" className="form-label">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="formName"
                    value={userFullName}
                    onChange={(e) => setUserFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formPhone" className="form-label">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="formPhone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-primary w-48"
                    onClick={handleConfirmBooking}
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary w-48"
                    onClick={handleCloseBookModal}
                  >
                    Cancel
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

export default UserDashboard;
