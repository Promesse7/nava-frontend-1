import React, { useState, useEffect } from 'react';
import { updateBookingStatus, getAllBookings } from '../../services/bookingService'; // Hypothetical service functions

const BookingManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingTicketId, setUpdatingTicketId] = useState(null); // Track which ticket is being updated
 
  // Fetch all bookings on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError('');
      try {
        const bookings = await getAllBookings(); // Fetch from your API
        setTickets(bookings);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Handle ticket status update (approve or cancel)
  const handleStatusUpdate = async (ticketId, newStatus) => {
    setUpdatingTicketId(ticketId);
    setError('');
    try {
      await updateBookingStatus(ticketId, newStatus); // Update status via API
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
    } catch (err) {
      console.error(`Error updating ticket ${ticketId}:`, err);
      setError(`Failed to ${newStatus.toLowerCase()} ticket. Please try again.`);
    } finally {
      setUpdatingTicketId(null);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center" role="status">
          <div className="w-12 h-12 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading tickets...</p>
          <span className="sr-only">Loading</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Ticket Management</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-900 text-red-900 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p>No tickets found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Booking ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Route</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Departure</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{ticket.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{ticket.route}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {ticket.fleet?.name || 'N/A'} ({ticket.fleet?.type || ''})
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {new Date(ticket.departureDate).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    ₦{ticket.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : ticket.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex space-x-2">
                      {ticket.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(ticket.id, 'approved')}
                            disabled={updatingTicketId === ticket.id}
                            className={`px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${
                              updatingTicketId === ticket.id
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                            aria-label={`Approve ticket ${ticket.id}`}
                          >
                            {updatingTicketId === ticket.id ? (
                              <span className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin inline-block"></span>
                            ) : (
                              'Approve'
                            )}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(ticket.id, 'canceled')}
                            disabled={updatingTicketId === ticket.id}
                            className={`px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
                              updatingTicketId === ticket.id
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                            aria-label={`Cancel ticket ${ticket.id}`}
                          >
                            {updatingTicketId === ticket.id ? (
                              <span className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin inline-block"></span>
                            ) : (
                              'Cancel'
                            )}
                          </button>
                        </>
                      )}
                      {ticket.status == 'approved' && (
                        <span className="text-gray-500">Ticket Approved!</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Optional PropTypes
/*
import PropTypes from 'prop-types';

AdminTicketManagement.propTypes = {
  // Add props if this component receives any from a parent
};
*/

export default BookingManagement;