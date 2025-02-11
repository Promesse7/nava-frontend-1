import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
// import { Input, Button } from '../ui/Button';
import Button from '../ui/Button';


// LoginForm Component


// RegisterForm Component


// ForgotPassword Component
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Handle password reset logic
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-600 mb-4">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          <Input
            icon={<Mail className="text-gray-400" />}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
      ) : (
        <div className="text-center">
          <div className="mb-4 text-green-600">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600">
            We've sent password reset instructions to your email.
          </p>
        </div>
      )}
    </div>
  );
};



export { LoginForm, RegisterForm, ForgotPassword, ProfilePage };