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

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  
  // Check for browser support of Web Speech API and Audio API
  const isSpeechRecognitionSupported = 'webkitSpeechRecognition' in window;
  const isAudioContextSupported = 'AudioContext' in window || 'webkitAudioContext' in window;

  // Setup audio visualization
  useEffect(() => {
    if (isAudioContextSupported && isListening) {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create analyser node
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      // Get microphone input
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          
          // Setup data array for visualization
          const bufferLength = analyserRef.current.frequencyBinCount;
          dataArrayRef.current = new Uint8Array(bufferLength);
          
          // Start visualization
          drawWaveform();
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
        });
      
      return () => {
        if (audioContextRef.current) {
          cancelAnimationFrame(animationRef.current);
          if (audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
          }
        }
      };
    }
  }, [isListening, isAudioContextSupported]);

  // Draw waveform animation
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get frequency data
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Draw waveform
    const barWidth = width / dataArrayRef.current.length;
    let x = 0;
    
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const barHeight = dataArrayRef.current[i] / 2;
      
      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#3B82F6'); // blue-500
      gradient.addColorStop(1, '#93C5FD'); // blue-300
      
      ctx.fillStyle = gradient;
      
      // Draw bar (mirror effect)
      const centerY = height / 2;
      ctx.fillRect(x, centerY - barHeight/2, barWidth - 1, barHeight);
      
      x += barWidth;
    }
    
    animationRef.current = requestAnimationFrame(drawWaveform);
  };

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
    <div className="max-w-4xl mx-auto p-4 bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">
        <Ticket className="inline-block mr-2 mb-1" /> Voice Ticket Booking
      </h2>
      
      <div className="max-h-[80vh] max-w-[80vw] overflow-y-auto px-2">
      <div className="max-w-xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex flex-col items-center justify-center mb-6">
          {/* Voice visualization area */}
          <div className="relative mb-8 w-full">
            <div className="bg-gray-900 rounded-xl p-4 relative overflow-hidden">
              {/* Profile image */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-34 h-34 rounded-full overflow-hidden border-4 border-blue-600 z-10 relative">
                    <img 
                      src={Mic}
                      alt="User profile" 
                      className="w-full h-full object-cover bg-gradient-to-b from-blue-100 to-white"
                    />
                  </div>
                  
                  {/* Circular border that pulses when listening */}
                  {isListening && (
                    <div className="absolute inset-0 w-34 h-34 rounded-full border-4 border-blue-400 animate-ping"></div>
                  )}
                </div>
              </div>
              
              
              {/* Waveform canvas */}
              <div className="h-24 w-full relative">
                <canvas 
                  ref={canvasRef} 
                  width="600" 
                  height="100" 
                  className="w-full h-full"
                ></canvas>
                
                {/* Overlay when not listening */}
                {!isListening && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-400 mb-2"></p>
                      <div className="flex justify-center">
                        <div className="w-8 h-1 bg-gray-600 rounded mx-1"></div>
                        <div className="w-12 h-1 bg-gray-600 rounded mx-1"></div>
                        <div className="w-6 h-1 bg-gray-600 rounded mx-1"></div>
                        <div className="w-10 h-1 bg-gray-600 rounded mx-1"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Microphone button */}
          <div className="relative mb-4">
            <button
              onClick={startVoiceRecognition}
              disabled={!isSpeechRecognitionSupported}
              className={`rounded-full flex items-center justify-center w-16 h-16 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
              } transition-all shadow-lg`}
              aria-label="Start Voice Recognition"
            >
              <FaMicrophone className="w-6 h-6" />
            </button>
            {isListening && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-red-500 font-medium">
                Listening...
              </div>
            )}
          </div>
          
          <p className="text-gray-600 text-center max-w-md mb-4">
            Click the microphone and speak commands like "book ticket"
          </p>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={voiceMessage}
            onChange={(e) => setVoiceMessage(e.target.value)}
            placeholder="Speak or type a command"
            className="flex-grow p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
            aria-live="polite"
          />

          <button
            onClick={sendVoiceMessage}
            className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow"
            aria-label="Send Voice Command"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>

        {!isSpeechRecognitionSupported && (
          <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg">
            Voice recognition not supported in this browser
          </p>
        )}
      </div>
    </div>

        {/* Event Search */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Find Events</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex-grow relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Location"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <button className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors shadow flex items-center justify-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Select Date</span>
            </button>
          </div>
        </div>

        {/* Event List */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Available Events</h3>
          
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="mb-3 sm:mb-0">
                  <h3 className="font-bold text-lg text-blue-700">{event.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{event.date}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPinned className="w-4 h-4 mr-1" />
                    <span>{event.venue}</span>
                  </div>
                  <p className="font-semibold text-green-600 mt-2">Rwf {event.price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => removeFromCart(event.id)}
                    className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                    aria-label={`Remove ${event.name} from cart`}
                  >
                    <MinusCircle className="w-6 h-6" />
                  </button>
                  
                  <span className="text-lg font-medium w-6 text-center">
                    {cart.find(item => item.id === event.id)?.quantity || 0}
                  </span>
                  
                  <button
                    onClick={() => addToCart(event)}
                    className="text-green-500 p-2 hover:bg-green-50 rounded-full transition-colors"
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
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Cart</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0"
                >
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <div className="text-sm text-gray-600">{item.date}</div>
                  </div>
                  <span className="font-medium text-right">
                    {item.quantity} × Rwf {item.price.toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="flex justify-between font-bold mt-3 pt-3 border-t border-gray-300 text-lg">
                <span>Total</span>
                <span className="text-blue-700">
                  Rwf {cart.reduce((total, item) =>
                    total + (item.price * item.quantity), 0
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            
            <button
              onClick={proceedToCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors shadow-md flex items-center justify-center"
            >
              <CreditCard className="mr-2 w-5 h-5" />
              Proceed to Checkout
            </button>
          </div>
        )}

        {/* Action History */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-blue-500" />
            Recent Actions
          </h3>
          
          {actionHistory.length > 0 ? (
            <ul className="max-h-48 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-gray-200">
              {actionHistory.map((action) => (
                <li
                  key={action.id}
                  className="flex items-center mb-2 p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500"
                >
                  <span className="text-sm">{action.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic p-3 bg-gray-50 rounded-lg">No actions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessibleTicketBooking;