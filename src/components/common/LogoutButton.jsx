// src/components/LogoutButton.jsx
import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
    >
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;