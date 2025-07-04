import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  MapPinned,
  Mic,
  MicOff,
  Volume2,
  Info,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Search,
  Star,
  Filter
} from 'lucide-react';
import { FaMicrophone } from 'react-icons/fa';
import MicIcon from '../../assets/microphone.png';

const VoiceBookingInterface = () => {
  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [actionHistory, setActionHistory] = useState([]);
  const [visualFeedback, setVisualFeedback] = useState([]);
  const recognitionRef = useRef(null);
  const [showTips, setShowTips] = useState(false);
  const [processingCommand, setProcessingCommand] = useState(false);

  // Ticket Booking State
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Kigali to Butare Express',
      date: 'July 15, 2025',
      time: '7:00 AM',
      venue: 'Nyabugogo Terminal',
      price: 5000,
      rating: 4.8,
      availableSeats: 32,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Kigali to Gisenyi Luxury',
      date: 'July 16, 2025',
      time: '8:30 AM',
      venue: 'Downtown Terminal',
      price: 8500,
      rating: 4.9,
      availableSeats: 24,
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Kigali to Musanze Direct',
      date: 'July 17, 2025',
      time: '6:00 AM',
      venue: 'Nyabugogo Terminal',
      price: 4500,
      rating: 4.6,
      availableSeats: 36,
      image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=2070&auto=format&fit=crop'
    }
  ]);

  const [cart, setCart] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchLocation, setSearchLocation] = useState('Kigali');
  const [searchDate, setSearchDate] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);

  // Voice command suggestions
  const voiceCommandExamples = [
    "Book a ticket to Butare",
    "Show available buses tomorrow",
    "Find buses to Gisenyi",
    "Select seat number 12",
    "Add to cart",
    "Remove from cart",
    "Checkout my booking",
    "What's the price?",
    "Help me book a ticket"
  ];

  // Check for browser support of Web Speech API
  const isSpeechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  // Start voice recognition
  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      addToActionHistory('Error', 'Speech recognition is not supported in this browser.');
      return;
    }
  
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
  
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      addVisualFeedback('listening');
    };
  
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setVoiceMessage(transcript);
      
      // Visual feedback for interim results
      if (event.results[0].isFinal) {
        addVisualFeedback('processing');
        processVoiceCommand(transcript);
      }
    };
  
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      addToActionHistory('Error', `Speech recognition error: ${event.error}`);
      addVisualFeedback('error');
    };
  
    recognitionRef.current.start();
  };

  // Add visual feedback for voice recognition
  const addVisualFeedback = (type) => {
    const newFeedback = { id: Date.now(), type };
    setVisualFeedback(prev => [...prev.slice(-4), newFeedback]);
    
    // Clear feedback after a delay
    if (type !== 'listening') {
      setTimeout(() => {
        setVisualFeedback(prev => prev.filter(item => item.id !== newFeedback.id));
      }, 3000);
    }
  };

  // Process voice commands
  const processVoiceCommand = (command) => {
    setProcessingCommand(true);
    const lowercaseCommand = command.toLowerCase();
    let action = '';
    let result = '';

    // Enhanced Voice Command Logic
    if (lowercaseCommand.includes('book ticket') || lowercaseCommand.includes('book a ticket')) {
      action = 'Booking ticket';
      result = 'Added trip to cart';
      
      // Find a matching event based on command text
      const matchingEvent = findMatchingEvent(lowercaseCommand);
      if (matchingEvent) {
        addToCart(matchingEvent);
      } else if (events.length > 0) {
        // Default to first event if no match
        addToCart(events[0]);
      }
    } 
    else if (lowercaseCommand.includes('select seat') || lowercaseCommand.includes('choose seat')) {
      action = 'Selecting seat';
      result = 'Seat selection mode activated';
      
      // Extract seat number if present
      const seatMatch = lowercaseCommand.match(/seat (\d+)/);
      if (seatMatch && seatMatch[1]) {
        result = `Selected seat ${seatMatch[1]}`;
      }
      
      // Open seat selection for first event in cart or first available
      if (cart.length > 0) {
        setSelectedEvent(events.find(e => e.id === cart[0].id));
      } else if (events.length > 0) {
        setSelectedEvent(events[0]);
      }
    } 
    else if (lowercaseCommand.includes('show') || lowercaseCommand.includes('find') || lowercaseCommand.includes('search')) {
      action = 'Searching';
      
      // Extract location if present
      const destinations = ['butare', 'gisenyi', 'musanze', 'huye', 'rubavu', 'rusizi', 'nyagatare'];
      const matchedDestination = destinations.find(dest => lowercaseCommand.includes(dest));
      
      if (matchedDestination) {
        setSearchLocation(matchedDestination.charAt(0).toUpperCase() + matchedDestination.slice(1));
        result = `Showing trips to ${matchedDestination}`;
        
        // Filter events based on destination
        const filtered = events.filter(event => 
          event.name.toLowerCase().includes(matchedDestination)
        );
        setFilteredEvents(filtered.length > 0 ? filtered : events);
      } else {
        result = 'Showing all available trips';
        setFilteredEvents(events);
      }
    } 
    else if (lowercaseCommand.includes('cancel') || lowercaseCommand.includes('clear cart')) {
      action = 'Cancelling booking';
      result = 'Cart cleared';
      setCart([]);
    } 
    else if (lowercaseCommand.includes('checkout') || lowercaseCommand.includes('pay') || lowercaseCommand.includes('complete booking')) {
      action = 'Proceeding to checkout';
      result = cart.length > 0 ? 'Processing payment' : 'Your cart is empty';
      if (cart.length > 0) proceedToCheckout();
    } 
    else if (lowercaseCommand.includes('help') || lowercaseCommand.includes('what can i say')) {
      action = 'Help requested';
      result = 'Showing voice command examples';
      setShowTips(true);
    }
    else if (lowercaseCommand.includes('price') || lowercaseCommand.includes('cost') || lowercaseCommand.includes('how much')) {
      action = 'Price inquiry';
      if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        result = `Total price is ${total.toLocaleString()} Rwf`;
      } else if (filteredEvents.length > 0) {
        const priceRange = getPriceRange(filteredEvents);
        result = `Prices range from ${priceRange.min.toLocaleString()} to ${priceRange.max.toLocaleString()} Rwf`;
      } else {
        result = 'No trips selected to show price';
      }
    }
    else {
      action = 'Unrecognized command';
      result = 'Sorry, I didn\'t understand that command';
    }

    // Add to action history
    addToActionHistory(action, result, command);
    
    // Reset processing state
    setTimeout(() => {
      setProcessingCommand(false);
    }, 1000);
  };

  // Find matching event based on command text
  const findMatchingEvent = (command) => {
    const destinations = ['butare', 'gisenyi', 'musanze', 'huye', 'rubavu', 'rusizi', 'nyagatare'];
    const matchedDestination = destinations.find(dest => command.includes(dest));
    
    if (matchedDestination) {
      return events.find(event => 
        event.name.toLowerCase().includes(matchedDestination)
      );
    }
    return null;
  };

  // Get price range for a list of events
  const getPriceRange = (eventList) => {
    const prices = eventList.map(event => event.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  // Add to action history
  const addToActionHistory = (action, result, command = '') => {
    const newAction = { 
      id: Date.now(), 
      action,
      result,
      command,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setActionHistory(prev => [newAction, ...prev.slice(0, 9)]);
  };

  // Send voice message manually
  const sendVoiceMessage = () => {
    if (voiceMessage.trim()) {
      processVoiceCommand(voiceMessage);
      setVoiceMessage('');
    }
  };

  // Add to cart
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

    addToActionHistory('Added to cart', `Added ${event.name} to cart`);
  };

  // Remove from cart
  const removeFromCart = (eventId) => {
    const itemToRemove = cart.find(item => item.id === eventId);
    if (itemToRemove) {
      setCart(cart.filter(item => item.id !== eventId));
      addToActionHistory('Removed from cart', `Removed ${itemToRemove.name} from cart`);
    }
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      addToActionHistory('Checkout error', 'Your cart is empty');
      return;
    }

    const totalPrice = cart.reduce((total, item) =>
      total + (item.price * item.quantity), 0
    );

    addToActionHistory('Checkout', `Checkout initiated. Total: ${totalPrice.toLocaleString()} Rwf`);

    // In a real app, this would redirect to a checkout page
    setTimeout(() => {
      alert(`Proceeding to checkout. Total: ${totalPrice.toLocaleString()} Rwf`);
    }, 500);
  };

  // Filter events based on search criteria
  useEffect(() => {
    let filtered = [...events];
    
    if (searchLocation && searchLocation !== 'Kigali') {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    if (searchDate) {
      // Simple date filtering logic - would be more sophisticated in a real app
      filtered = filtered.filter(event => 
        new Date(event.date) >= new Date(searchDate)
      );
    }
    
    setFilteredEvents(filtered);
  }, [searchLocation, searchDate, events]);

  // Render voice visualization
  const renderVoiceVisualization = () => {
    if (isListening) {
      return (
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-indigo-500 rounded-full"
              animate={{
                height: [15, 30, 45, 30, 15],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg text-gray-900 dark:text-white">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100"
      >
        <Ticket className="inline-block mr-2 mb-1 text-indigo-600" /> Voice-Enabled Booking
      </motion.h2>
      
      <div className="max-h-[80vh] overflow-y-auto px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Voice Interface */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md"
            >
              <div className="mb-8">
                <div className="flex flex-col items-center justify-center mb-6">
                  {/* Voice visualization area */}
                  <div className="relative mb-6 w-full">
                    <div className="bg-white dark:bg-gray-700 rounded-xl p-6 relative overflow-hidden shadow-inner">
                      {/* Microphone image */}
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <motion.div 
                            className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-900 z-10 relative"
                            animate={{ 
                              boxShadow: isListening 
                                ? ['0 0 0 0 rgba(99, 102, 241, 0.4)', '0 0 0 20px rgba(99, 102, 241, 0)'] 
                                : '0 0 0 0 rgba(99, 102, 241, 0)'
                            }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: isListening ? Infinity : 0,
                              repeatType: "loop"
                            }}
                          >
                            <div className="w-full h-full bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900 dark:to-gray-800 flex items-center justify-center">
                              {isListening ? (
                                <Volume2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                              ) : (
                                <Mic className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                              )}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Voice visualization */}
                      <div className="h-8 flex items-center justify-center">
                        {renderVoiceVisualization()}
                        
                        {/* Status text */}
                        {!isListening && !processingCommand && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {isSpeechRecognitionSupported ? "Ready to listen" : "Voice not supported"}
                          </span>
                        )}
                        
                        {processingCommand && (
                          <span className="text-sm text-indigo-600 dark:text-indigo-400 animate-pulse">
                            Processing command...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Microphone button */}
                  <div className="relative mb-4">
                    <motion.button
                      onClick={startVoiceRecognition}
                      disabled={!isSpeechRecognitionSupported || isListening}
                      className={`rounded-full flex items-center justify-center w-16 h-16 ${
                        isListening 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600'
                      } transition-all shadow-lg`}
                      aria-label="Start Voice Recognition"
                      whileTap={{ scale: 0.95 }}
                    >
                      {isListening ? (
                        <MicOff className="w-8 h-8" />
                      ) : (
                        <FaMicrophone className="w-8 h-8" />
                      )}
                    </motion.button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-4">
                    {isListening 
                      ? "Listening... speak your command" 
                      : "Click the microphone and speak a command"}
                  </p>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={voiceMessage}
                    onChange={(e) => setVoiceMessage(e.target.value)}
                    placeholder="Type a command or speak"
                    className="flex-grow p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-gray-900 dark:text-gray-100"
                    aria-live="polite"
                  />

                  <motion.button
                    onClick={sendVoiceMessage}
                    className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow"
                    aria-label="Send Command"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-6 h-6" />
                  </motion.button>
                </div>

                {!isSpeechRecognitionSupported && (
                  <div className="text-gray-600 dark:text-gray-300 text-sm mt-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <AlertTriangle className="inline-block w-4 h-4 mr-1 text-yellow-600 dark:text-yellow-500" />
                    Voice recognition is not supported in this browser. Please try Chrome or Edge.
                  </div>
                )}
                
                {/* Voice command examples */}
                <div className="mt-6">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowTips(!showTips)}
                  >
                    <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      <HelpCircle className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      Voice Command Examples
                    </h3>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showTips ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <AnimatePresence>
                    {showTips && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800">
                          <ul className="space-y-2">
                            {voiceCommandExamples.map((example, index) => (
                              <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                                <ChevronRight className="w-4 h-4 mr-1 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                                <span>"{example}"</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Action History */}
              <div className="mt-6">
                <h3 className="text-md font-medium mb-3 text-gray-900 dark:text-gray-100 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Recent Actions
                </h3>
                
                <div className="max-h-64 overflow-y-auto bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-inner">
                  {actionHistory.length > 0 ? (
                    <ul className="space-y-2">
                      {actionHistory.map((action) => (
                        <motion.li
                          key={action.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-indigo-500 dark:border-indigo-600"
                        >
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span className="font-medium">{action.action}</span>
                            <span>{action.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{action.result}</p>
                          {action.command && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                              "{action.command}"
                            </p>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic text-sm p-2">
                      No actions yet. Try speaking a command.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Booking Interface */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
            >
              {/* Search Controls */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Find Your Trip</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Destination"
                      className="w-full pl-10 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="w-full pl-10 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <Search className="w-4 h-4 mr-2" />
                    <span>Search Trips</span>
                  </button>
                </div>
              </div>

              {/* Trip List */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Available Trips</h3>
                  <button className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <Filter className="w-4 h-4 mr-1" />
                    <span>Filter</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 transition-all bg-white dark:bg-gray-800"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3 h-32 sm:h-auto bg-gray-200 dark:bg-gray-700 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-indigo-600/5"></div>
                          <div className="absolute bottom-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">
                            {event.availableSeats} seats left
                          </div>
                        </div>
                        
                        <div className="p-4 sm:w-2/3 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{event.name}</h3>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-medium">{event.rating}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <MapPinned className="w-4 h-4 mr-1 text-gray-400" />
                                <span>{event.venue}</span>
                              </div>
                              <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                                <CreditCard className="w-4 h-4 mr-1 text-gray-400" />
                                <span>{event.price.toLocaleString()} Rwf</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => removeFromCart(event.id)}
                                className={`p-2 rounded-full ${
                                  cart.find(item => item.id === event.id)
                                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                                disabled={!cart.find(item => item.id === event.id)}
                                aria-label={`Remove ${event.name} from cart`}
                              >
                                <MinusCircle className="w-5 h-5" />
                              </button>
                              
                              <span className="text-lg font-medium w-6 text-center">
                                {cart.find(item => item.id === event.id)?.quantity || 0}
                              </span>
                              
                              <button
                                onClick={() => addToCart(event)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors"
                                aria-label={`Add ${event.name} to cart`}
                              >
                                <PlusCircle className="w-5 h-5" />
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => addToCart(event)}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {filteredEvents.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No trips found matching your criteria</p>
                      <button 
                        onClick={() => {
                          setSearchLocation('Kigali');
                          setSearchDate('');
                          setFilteredEvents(events);
                        }}
                        className="mt-2 text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Reset search
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Your Cart</h3>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-600 last:border-0 last:mb-0 last:pb-0"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{item.date} at {item.time}</div>
                        </div>
                        <span className="font-medium text-right text-gray-900 dark:text-white">
                          {item.quantity} × {item.price.toLocaleString()} Rwf
                        </span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between font-bold mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-lg">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {cart.reduce((total, item) =>
                          total + (item.price * item.quantity), 0
                        ).toLocaleString()} Rwf
                      </span>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={proceedToCheckout}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors shadow-md flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CreditCard className="mr-2 w-5 h-5" />
                    Proceed to Checkout
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceBookingInterface;
