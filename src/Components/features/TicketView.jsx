import React, { useState } from 'react';
import { Star, Bell, Clock, Download, Printer } from 'lucide-react';
import { Button } from '../common';
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

  export default TicketView;