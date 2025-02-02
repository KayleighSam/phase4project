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
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || '');
        }

        const data = await response.json();
        if (data && data.bookings) {
          setBookings(data.bookings);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        setError(error.message || 'An error occurred while fetching bookings.');
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this booking?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.booking_id !== bookingId)
        );
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError(error.message || 'An error occurred while deleting booking.');
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.booking_id === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError(error.message || 'An error occurred while updating booking status.');
    }
  };

  return (
    <div>
      <AdminHeader />
      <AdminNav />
      <div className="container">
        <h1>Manage Requests</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <table className="table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Property ID</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td>{booking.booking_id}</td>
                <td>{booking.property_id}</td>
                <td>{booking.phone_number}</td>
                <td>
                  <select
                    value={booking.status}
                    onChange={(e) => handleUpdateStatus(booking.booking_id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteBooking(booking.booking_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRequests;
