import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  ArrowRight,
  MapPin,
  Calendar,
  CreditCard,
  ChevronDown,
  PlusCircle,
  MinusCircle
} from 'lucide-react';

import Lottie from 'react-lottie';
import waveformAnimation from "../../assets/animations/waveform-animation.json";
import { FaMicrophone } from 'react-icons/fa';

const AccessibleTicketBooking = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [actionHistory, setActionHistory] = useState([]);
  const recognitionRef = useRef(null);

  // Ticket Booking State
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Summer Music Festival',
      date: 'July 15, 2025',
      time: '7:00 PM',
      venue: 'Central Park',
      price: 65.00,
      availableSeats: 100
    },
    {
      id: 2,
      name: 'Broadway Show',
      date: 'August 22, 2025',
      time: '8:00 PM',
      venue: 'Theater District',
      price: 89.50,
      availableSeats: 50
    }
  ]);

  const [cart, setCart] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [searchLocation, setSearchLocation] = useState('New York');



  

  // Check for browser support of Web Speech API
  const isSpeechRecognitionSupported = 'webkitSpeechRecognition' in window;

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isSpeechRecognitionSupported = !!SpeechRecognition;
  
    if (!isSpeechRecognitionSupported) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
  
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
  
    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };
  
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setVoiceMessage(transcript);
      // processVoiceCommand(transcript); // Uncomment if you have this function
    };
  
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      alert('An error occurred during speech recognition: ' + event.error);
    };
  
    recognitionRef.current.start();
  };

  const processVoiceCommand = (command) => {
    const lowercaseCommand = command.toLowerCase();
    let action = '';

    // Enhanced Voice Command Logic
    if (lowercaseCommand.includes('book ticket')) {
      action = 'Booking ticket';
      // Automatically select first available event
      if (events.length > 0) {
        addToCart(events[0]);
      }
    } else if (lowercaseCommand.includes('select seat')) {
      action = 'Selecting seat';
      // Open seat selection for first event
      if (events.length > 0) {
        setSelectedEvent(events[0]);
      }
    } else if (lowercaseCommand.includes('show events')) {
      action = 'Displaying available events';
      // Could trigger a modal or scroll to events list
    } else if (lowercaseCommand.includes('cancel booking')) {
      action = 'Cancelling current booking';
      setCart([]);
    } else if (lowercaseCommand.includes('checkout')) {
      action = 'Proceeding to checkout';
      proceedToCheckout();
    } else {
      action = 'Unrecognized command';
    }

    // Update action history
    setActionHistory(prev => [
      { id: Date.now(), text: `${action}: "${command}"` },
      ...prev
    ]);
  };

  const sendVoiceMessage = () => {
    if (voiceMessage.trim()) {
      processVoiceCommand(voiceMessage);
      setVoiceMessage('');
    }
  };

  const addToCart = (event) => {
    const existingCartItem = cart.find(item => item.id === event.id);

    if (existingCartItem) {
      setCart(cart.map(item =>
        item.id === event.id
          ? { ...item, quantity: Math.min(item.quantity + 1, event.availableSeats) }
          : item
      ));
    } else {
      setCart([...cart, { ...event, quantity: 1 }]);
    }

    setActionHistory(prev => [
      { id: Date.now(), text: `Added ${event.name} to cart` },
      ...prev
    ]);
  };

  const removeFromCart = (eventId) => {
    setCart(cart.filter(item => item.id !== eventId));

    setActionHistory(prev => [
      { id: Date.now(), text: `Removed event from cart` },
      ...prev
    ]);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const totalPrice = cart.reduce((total, item) =>
      total + (item.price * item.quantity), 0
    );

    setActionHistory(prev => [
      {
        id: Date.now(),
        text: `Checkout initiated. Total: $${totalPrice.toFixed(2)}`
      },
      ...prev
    ]);

    // In a real app, this would redirect to a checkout page
    alert(`Proceeding to checkout. Total: $${totalPrice.toFixed(2)}`);
  };

  return (
    <div className="max-w-3xl mx-auto mb-4 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Accessible Ticket Booking
      </h2>
      <div className=' max-h-[85vh] overflow-y-auto '>
        {/* Voice Recognition Section */}
        <div className="mb-4">

          <div className="flex items-center space-x-2 justify-center my-10">
            {/* Waveform Animation (visible when listening) */}
           {isListening && (
        <div className="absolute inset-0 flex items-center justify-center">
         <Lottie animationData={waveformAnimation} loop={true} style={{ width: 400, height: 400 }} />
        </div>
      )}
            <button
              onClick={startVoiceRecognition}
              disabled={!isSpeechRecognitionSupported}
              className={`p-2 rounded-full size-[30vh] ${isListening
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-colors`}
              aria-label="Start Voice Recognition"
            >
              <FaMicrophone className="w-20 h-20 text-center align-middle" />
            </button>
          </div>
          <div className="flex items-center space-x-2">


            <input
              type="text"
              value={voiceMessage}
              onChange={(e) => setVoiceMessage(e.target.value)}
              placeholder="Speak or type a command"
              className="flex-grow p-2 border rounded"
              aria-live="polite"
            />

            <button
              onClick={sendVoiceMessage}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
              aria-label="Send Voice Command"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>

          {!isSpeechRecognitionSupported && (
            <p className="text-red-500 text-sm mt-2">
              Voice recognition not supported in this browser
            </p>
          )}
        </div>

        {/* Event Search */}
        <div className="mb-4 flex space-x-2">
          <div className="flex-grow relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Location"
              className="w-full pl-10 p-2 border rounded"
            />
          </div>
          <button className="bg-blue-500 text-white p-2 rounded">
            <Calendar className="w-5 h-5" />
          </button>
        </div>

        {/* Event List */}
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{event.name}</h3>
                <p className="text-sm text-gray-600">
                  {event.date} | {event.time}
                </p>
                <p className="text-sm text-gray-600">{event.venue}</p>
                <p className="font-semibold">${event.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => removeFromCart(event.id)}
                  className="text-red-500"
                >
                  <MinusCircle />
                </button>
                <span>{cart.find(item => item.id === event.id)?.quantity || 0}</span>
                <button
                  onClick={() => addToCart(event)}
                  className="text-green-500"
                >
                  <PlusCircle />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-bold mb-2">Cart</h3>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-2"
              >
                <span>{item.name}</span>
                <span>
                  {item.quantity} x ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2">
              <span>Total</span>
              <span>
                ${cart.reduce((total, item) =>
                  total + (item.price * item.quantity), 0
                ).toFixed(2)}
              </span>
            </div>
            <button
              onClick={proceedToCheckout}
              className="w-full bg-blue-500 text-white p-2 rounded mt-2"
            >
              Proceed to Checkout
            </button>
          </div>
        )}

        {/* Action History */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Recent Actions</h3>
          <ul className="max-h-40 overflow-y-auto bg-gray-100 p-2 rounded">
            {actionHistory.map((action) => (
              <li
                key={action.id}
                className="flex items-center mb-2 p-2 bg-white rounded shadow-sm"
              >
                <ArrowRight className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm">{action.text}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};

export default AccessibleTicketBooking;