import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  ArrowRight,
  MapPin,
  Calendar,
  CreditCard,
  PlusCircle,
  MinusCircle,
  Clock,
  Ticket,
  MapPinned
} from 'lucide-react';
import { FaMicrophone } from 'react-icons/fa';
import Mic from '../../assets/microphone.png';
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
      venue: 'Rusizi District',
      price: 89.50,
      availableSeats: 50
    }
  ]);

  const [cart, setCart] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchLocation, setSearchLocation] = useState('Kigali');

  // Check for browser support of Web Speech API

  // Check for browser support of Web Speech API and Audio API
  const isSpeechRecognitionSupported = 'webkitSpeechRecognition' in window;
  

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
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
    <div className="max-w-4xl mx-auto p-4 bg-gray-900 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-100">
        <Ticket className="inline-block mr-2 mb-1" /> Voice Ticket Booking
      </h2>
      
      <div className="max-h-[80vh] max-w-[80vw] overflow-y-auto px-2">
      <div className="max-w-xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex flex-col items-center justify-center mb-6">
          {/* Voice visualization area */}
          <div className="relative mb-8 w-full">
            <div className="bg-gray-800 rounded-xl p-4 relative overflow-hidden">
              {/* Profile image */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 z-10 relative">
                    <img 
                      src={Mic}
                      alt="User profile" 
                      className="w-full h-full object-cover bg-gradient-to-b from-blue-100 to-white"
                    />
                  </div>
                  
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Microphone button */}
          <div className="relative mb-4">
            <button
              onClick={startVoiceRecognition}
              disabled={!isSpeechRecognitionSupported}
              className="rounded-full flex items-center justify-center w-12 h-12 bg-gray-700 text-white hover:bg-gray-600 transition-all shadow-lg"
              aria-label="Start Voice Recognition"
            >
              <FaMicrophone className="w-6 h-6" />
            </button>
            
          </div>
          
          <p className="text-gray-300 text-center max-w-md mb-4">
            Click the microphone and speak commands like "book ticket"
          </p>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={voiceMessage}
            onChange={(e) => setVoiceMessage(e.target.value)}
            placeholder="Speak or type a command"
            className="flex-grow p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-300 focus:outline-none text-gray-100"
            aria-live="polite"
          />

          <button
            onClick={sendVoiceMessage}
            className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors shadow"
            aria-label="Send Voice Command"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>

        {!isSpeechRecognitionSupported && (
          <p className="text-gray-300 text-sm mt-2 bg-gray-800 p-2 rounded-lg">
            Voice recognition not supported in this browser
          </p>
        )}
      </div>
    </div>

        {/* Event Search */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-100">Find Events</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex-grow relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Location"
                className="w-full pl-10 p-3 bg-gray-700 rounded-lg text-gray-100"
              />
            </div>
            <button className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors shadow flex items-center justify-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Select Date</span>
            </button>
          </div>
        </div>

        {/* Event List */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-100">Available Events</h3>
          
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-800"
            >
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="mb-3 sm:mb-0">
                  <h3 className="font-bold text-lg text-gray-100">{event.name}</h3>
                  <div className="flex items-center text-sm text-gray-300 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{event.date}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300 mt-1">
                    <MapPinned className="w-4 h-4 mr-1" />
                    <span>{event.venue}</span>
                  </div>
                  <p className="font-semibold text-gray-100 mt-2">Rwf {event.price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => removeFromCart(event.id)}
                    className="text-gray-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
                    aria-label={`Remove ${event.name} from cart`}
                  >
                    <MinusCircle className="w-6 h-6" />
                  </button>
                  
                  <span className="text-lg font-medium w-6 text-center">
                    {cart.find(item => item.id === event.id)?.quantity || 0}
                  </span>
                  
                  <button
                    onClick={() => addToCart(event)}
                    className="text-gray-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
                    aria-label={`Add ${event.name} to cart`}
                  >
                    <PlusCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">Your Cart</h3>
            
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-3 pb-3 border-b border-gray-600 last:border-0 last:mb-0 last:pb-0"
                >
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <div className="text-sm text-gray-300">{item.date}</div>
                  </div>
                  <span className="font-medium text-right">
                    {item.quantity} × Rwf {item.price.toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="flex justify-between font-bold mt-3 pt-3 border-t border-gray-600 text-lg">
                <span>Total</span>
                <span className="text-gray-100">
                  Rwf {cart.reduce((total, item) =>
                    total + (item.price * item.quantity), 0
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            
            <button
              onClick={proceedToCheckout}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors shadow-md flex items-center justify-center"
            >
              <CreditCard className="mr-2 w-5 h-5" />
              Proceed to Checkout
            </button>
          </div>
        )}

        {/* Action History */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-100 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-gray-500" />
            Recent Actions
          </h3>
          
          {actionHistory.length > 0 ? (
            <ul className="max-h-48 overflow-y-auto bg-gray-700 p-3 rounded-lg border border-gray-600">
              {actionHistory.map((action) => (
                <li
                  key={action.id}
                  className="flex items-center mb-2 p-3 bg-gray-800 rounded-lg shadow-sm border-l-4 border-gray-500"
                >
                  <span className="text-sm">{action.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300 italic p-3 bg-gray-700 rounded-lg">No actions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessibleTicketBooking;
