import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import UserNav from "./UserNav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userFullName, setUserFullName] = useState("");

  useEffect(() => {
    // Fetch user profile data
    fetch("http://127.0.0.1:5000/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.name) {
          setUserName(data.name);
          setUserFullName(data.name);
        } else {
          console.error("Failed to fetch user profile");
        }
      })
      .catch((error) => console.error("Error fetching user profile:", error));

    // Fetch properties
    fetch("http://127.0.0.1:5000/properties", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setProperties(data.properties);
        setFilteredProperties(data.properties);
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }, []);

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
    if (!phoneNumber || !userFullName) {
      toast.error("Please fill in your full name and phone number.");
      return;
    }

    const bookingData = {
      user_name: userFullName,
      property_id: selectedProperty.property_id,
      phone_number: phoneNumber,
    };

    // Send booking data to the backend
    fetch("http://127.0.0.1:5000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`, // Assuming JWT is stored in localStorage
      },
      body: JSON.stringify(bookingData),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Booking created successfully") {
          toast.success("Booking confirmed successfully!");
          handleCloseBookModal();
        } else {
          toast.error(`Error: ${data.message || "Something went wrong"}`);
        }
      })
      .catch((error) => {
        console.error("Error making booking:", error);
        toast.error("An error occurred while making the booking.");
      });
  };

  return (
    <div>
      <UserNav />
      <div className="container mt-4">
        <div className="alert alert-primary text-center">
          <h2>Welcome, {userName || "User"}!</h2>
          <h4>Book with us for the best properties available!</h4>
        </div>
      </div>

      <div className="container mt-4">
        <h1 className="mb-4">Available Properties</h1>

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
            <p className="text-center text-muted">No properties available at the moment.</p>
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
                <strong>Price:</strong> {selectedProperty?.price}
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
              <h5 className="modal-title">Confirm Booking</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseBookModal}
              ></button>
            </div>
            <div className="modal-body">
              <p><strong>Property:</strong> {selectedProperty?.title}</p>
              <div className="mb-3">
                <label htmlFor="userName" className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  value={userFullName}
                  onChange={(e) => setUserFullName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseBookModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
