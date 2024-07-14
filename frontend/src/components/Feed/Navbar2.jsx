import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Navbar2() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');  
  };
  const handleWeekly = () => {
    navigate('/weekly');  
  };

  const handleFeed = () => {
    navigate('/feed');  
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <div className="w-full px-10 py-3 flex justify-between bg-white text-black items-center">
      <img src="https://aartisto.com/wp-content/uploads/2020/11/myntra.png" className='h-[50px] w-[50px]' alt="logo" />
      <div className="relative ml-52 ">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-2 border-gray-300 bg-gray-100 rounded-full py-2 pl-10 pr-4 w-96 focus:outline-none focus:border-gray-500 text-gray-800"
          />
          <button type="submit" className="hidden">Search</button>
        </form>
        <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-bold text-lg"></i>
      </div>
      <div className="flex gap-10 items-center">
      <a onClick={handleWeekly}>Weekly Challenge</a>
        <a onClick={handleProfile}>Profile</a>
        <a onClick={handleFeed}>Feed</a>
        <a onClick={handleLogout} className="px-3 py-2 bg-pink-200 hover:bg-pink-300 text-black rounded-md">Logout</a>
      </div>
    </div>
  );
}

export default Navbar2;
