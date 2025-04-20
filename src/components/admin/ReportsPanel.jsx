

// NotificationPanel Component
const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Booking Confirmed',
      message: 'Your bus booking #BK123 has been confirmed',
      time: '2min ago',
      unread: true
    },
    {
      id: 2,
      title: 'Price Drop Alert',
      message: 'Prices have dropped for your saved route',
      time: '1h ago',
      unread: false
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <Bell className="text-gray-500" />
      </div>
      
      <div className="divide-y">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              notif.unread ? 'bg-blue-50' : ''
            }`}
            onClick={() => markAsRead(notif.id)}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium">{notif.title}</h4>
              <span className="text-xs text-gray-500">{notif.time}</span>
            </div>
            <p className="text-sm text-gray-600">{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// BookingHistory Component
const BookingHistory = () => {
  const [bookings] = useState([
    {
      id: 'BK123',
      from: 'New York',
      to: 'Boston',
      date: '2024-01-15',
      status: 'completed',
      price: 45.00
    },
    {
      id: 'BK124',
      from: 'Boston',
      to: 'Washington DC',
      date: '2024-01-20',
      status: 'upcoming',
      price: 55.00
    }
  ]);

  return (
    <div className="w-full bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Booking History</h3>
      </div>
      
      <div className="divide-y">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-sm text-gray-500">Booking ID: {booking.id}</span>
                <h4 className="font-medium">{booking.from} → {booking.to}</h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {booking.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {booking.date}
              </div>
              <span className="font-medium">${booking.price}</span>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <Button size="small" variant="outline" className="flex items-center">
                <Download className="w-4 h-4 mr-1" />
                Ticket
              </Button>
              <Button size="small" variant="outline" className="flex items-center">
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// TicketView Component
const TicketView = ({ ticket }) => {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">Bus Ticket</h3>
        <p className="text-gray-500">Booking ID: {ticket?.id || 'BK12345'}</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between p-3 bg-gray-50 rounded">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="font-medium">{ticket?.from || 'New York'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">To</p>
            <p className="font-medium">{ticket?.to || 'Boston'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{ticket?.date || '2024-01-15'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">{ticket?.time || '10:30 AM'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Seat No.</p>
            <p className="font-medium">{ticket?.seat || '12A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bus Type</p>
            <p className="font-medium">{ticket?.busType || 'Express'}</p>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <p className="font-medium">Total Amount</p>
            <p className="text-xl font-bold">${ticket?.price || '45.00'}</p>
          </div>
        </div>

        <div className="flex space-x-2 mt-6">
          <Button className="flex-1 flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" className="flex-1 flex items-center justify-center">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
};





export { ReviewSection, NotificationPanel, BookingHistory, TicketView };






