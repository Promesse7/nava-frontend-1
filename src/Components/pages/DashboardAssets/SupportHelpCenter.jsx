import React, { useState } from 'react';
import { 
  MessageCircle, 
  FileText, 
  Scale, 
  AlertTriangle, 
  ChevronRight, 
  Search 
} from 'lucide-react';

const SupportHelpCenter = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const supportSections = [
    {
      icon: <MessageCircle className="w-10 h-10 text-blue-600" />,
      title: "Live Chat / Customer Support",
      description: "Get instant help from our dedicated support agents.",
      color: "blue"
    },
    {
      icon: <FileText className="w-10 h-10 text-green-600" />,
      title: "FAQs & Ride Policies",
      description: "Find answers to the most common questions.",
      color: "green"
    },
    {
      icon: <Scale className="w-10 h-10 text-purple-600" />,
      title: "Terms & Conditions",
      description: "Review our user agreement and policies.",
      color: "purple"
    },
    {
      icon: <AlertTriangle className="w-10 h-10 text-red-600" />,
      title: "Report an Issue",
      description: "Submit complaints, lost items, or driver-related concerns.",
      color: "red"
    }
  ];

  const faqData = [
    {
      question: "How do I cancel my ride?",
      answer: "You can cancel a ride through the app up to 15 minutes before pickup without charge."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, Apple Pay, Google Pay, and PayPal."
    },
    {
      question: "Are there any additional fees?",
      answer: "Pricing includes base fare, distance, and time. Surge pricing may apply during peak hours."
    }
  ];

  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 p-6 overflow-scroll">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h1 className="text-3xl font-bold text-white">Support & Help Center</h1>
          <p className="text-blue-100 mt-2">We're here to help you every step of the way</p>
        </div>

        {/* Support Sections Grid */}
        <div className="grid md:grid-cols-2 gap-4 p-6">
          {supportSections.map((section, index) => (
            <div 
              key={index}
              className={`
                border rounded-lg p-4 flex items-center space-x-4 
                cursor-pointer transition-all duration-300
                ${activeSection === index 
                  ? `bg-${section.color}-50 border-${section.color}-300 scale-105` 
                  : 'bg-gray-50 hover:bg-gray-100'}
              `}
              onClick={() => setActiveSection(index === activeSection ? null : index)}
            >
              {section.icon}
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
                <p className="text-gray-600">{section.description}</p>
              </div>
              <ChevronRight className="ml-auto text-gray-400" />
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="p-6 bg-gray-100">
          <div className="flex items-center mb-4 bg-white rounded-lg border p-2">
            <Search className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search FAQs..."
              className="w-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredFAQs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border rounded-lg p-4 mb-3 hover:shadow-sm transition"
            >
              <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}

          {filteredFAQs.length === 0 && (
            <div className="text-center text-gray-500 p-4">
              No FAQs found matching your search.
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="p-6 bg-white border-t">
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Email Support</h4>
              <p className="text-gray-600">travel-rda@gmail.com</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Phone Support</h4>
              <p className="text-gray-600">+250 (798) 515489</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportHelpCenter;