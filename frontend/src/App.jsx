import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/register/Register';
import Login from './components/login/Login';
import Feed from './components/Feed/Feed';
import ImageGen from './components/imagegeneration/ImageGen';  // Import ImageGen
import UserProfile from './components/userprofile/UserProfile';
import BoardDisplay from './components/boarddisplay/BoardDisplay';
import Feedcard from './components/Feed/Feedcard';
import SearchResults from './components/Feed/SearchResults';
import WeeklyChallenge from './components/weeklychallenge/WeeklyChallenge';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/image-gen" element={<ImageGen />} /> 
        <Route path="/profile" element={<UserProfile />} />  
        <Route path="/board/:boardId" element={<BoardDisplay />} />
        <Route path="/post/:postId" element={<Feedcard />} />  
        <Route path="/search" element={<SearchResults />} />
        <Route path="/weekly" element={<WeeklyChallenge />} />
      </Routes>
    </Router>
  );
}

export default App;
