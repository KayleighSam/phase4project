import React, { useEffect, useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminNav from './AdminNav';

const ManageRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/bookings', {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.text(); // Read the response as text (to handle HTML errors)
          throw new Error(errorData || 'Failed to fetch bookings');
        }

        // Attempt to parse the JSON data
        const data = await response.json();
        setBookings(data.bookings);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <AdminHeader />
        <AdminNav />
        <div className="admin-content">
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <AdminHeader />
      <AdminNav />
      <div className="admin-content">
        <h3>Manage Requests</h3>
        {error && <p className="text-danger">Error: {error}</p>}

        {bookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Booking ID</th>
                <th scope="col">Property ID</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{booking.property_id}</td>
                  <td>{booking.phone_number}</td>
                  <td>{new Date(booking.booking_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;
