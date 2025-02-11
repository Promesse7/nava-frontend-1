import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
 import Input from '../ui/Input';
import Button from '../ui/Button';


const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
    console.log('Login attempt:', formData);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </div>
  );
};


export default LoginForm;