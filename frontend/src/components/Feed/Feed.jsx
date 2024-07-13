import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Feed() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Feed</h1>
      <button
        onClick={handleLogout}
        className="w-full h-12 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Feed;
