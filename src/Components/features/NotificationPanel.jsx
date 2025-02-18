import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Tag, Clock, X, Settings, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Booking Confirmed',
      message: 'Your booking for Route 42 to Downtown Terminal has been confirmed.',
      time: '2 minutes ago',
      isRead: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Schedule Change',
      message: 'Route 15 to Airport is delayed by 15 minutes due to traffic.',
      time: '15 minutes ago',
      isRead: false
    },
    {
      id: 3,
      type: 'promo',
      title: 'Weekend Special Offer',
      message: 'Get 20% off on all weekend routes. Use code WEEKEND20.',
      time: '1 hour ago',
      isRead: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Route Update',
      message: 'New stop added to Route 7 at Beach Boulevard.',
      time: '2 hours ago',
      isRead: true
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={20} />;
      case 'promo':
        return <Tag className="text-purple-500" size={20} />;
      case 'info':
        return <Clock className="text-blue-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Bell size={24} className="text-blue-500" />
            Notifications
          </CardTitle>
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" />
            <button 
              className="text-sm text-blue-500 hover:text-blue-600"
              onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
            >
              Mark all as read
            </button>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filter === f 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notifications to show
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        <div className="relative group">
                          <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
                          <div className="absolute right-0 mt-1 hidden group-hover:block bg-white shadow-lg rounded-lg py-1 w-32 z-10">
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            >
                              Mark as read
                            </button>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;