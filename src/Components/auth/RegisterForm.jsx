import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
// import { Input, Button } from '../ui/Button';
import Button from '../ui/Button';


const RegisterForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle registration logic
      console.log('Registration attempt:', formData);
    };
  
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            icon={<User className="text-gray-400" />}
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input
            icon={<Mail className="text-gray-400" />}
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input
            icon={<Lock className="text-gray-400" />}
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <Input
            icon={<Lock className="text-gray-400" />}
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
          <Button type="submit" className="w-full">Create Account</Button>
        </form>
      </div>
    );
  };


  export default RegisterForm;