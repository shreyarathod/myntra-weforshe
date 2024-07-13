import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
    


  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

 

  const handleProfile = () => {
    navigate('/profile');  
  };
  const handleFeed = () => {
    navigate('/feed');  
  };

  return (
    <div class="w-full px-10 py-3 flex justify-between bg-white text-black items-center">
    <img src="https://aartisto.com/wp-content/uploads/2020/11/myntra.png" className='h-[50px] w-[50px]' alt="logo" />
    <div class="flex gap-10 items-center">
      <a  onClick={handleProfile}>Profile</a>
      <a onClick={handleFeed}>Feed</a>
      <a onClick={handleLogout} class="px-3 py-2 bg-pink-200 hover:bg-pink-300 text-black rounded-md">Logout</a>
    </div>
  </div>
  )
}

export default Navbar