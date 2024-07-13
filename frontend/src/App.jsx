import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/register/Register';
import Login from './components/login/Login';
import Feed from './components/Feed/Feed';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={
          
            <Feed />
         
        } />
      </Routes>
    </Router>
  );
}

export default App;
