import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Navbar2() {
    


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
    <div className="relative ml-52 ">
        <form method='get' action=''>
        <input
          type="text"
          placeholder="Search..."
          className="border-2 border-gray-300 bg-gray-100 rounded-full py-2 pl-10 pr-4 w-96 focus:outline-none focus:border-gray-500 text-gray-800"
        />
        </form>
        <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-bold text-lg"></i>
      </div>
    <div class="flex gap-10 items-center">
      <a  onClick={handleProfile}>Profile</a>
      <a onClick={handleFeed}>Feed</a>
      <a onClick={handleLogout} class="px-3 py-2 bg-pink-200 hover:bg-pink-300 text-black rounded-md">Logout</a>
    </div>
  </div>
  )
}

export default Navbar2
