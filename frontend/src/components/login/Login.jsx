import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axiosInstance.post('/users/login', { email, password });
  
      if (response.status === 200) {
        // Save tokens to localStorage
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
  
        navigate('/feed');  // Redirect to /feed after login
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error.response?.data?.message || error.message);
    }
  };
  
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1559762705-2123aa9b467f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
      <div className="w-[400px] bg-transparent border-2 border-zinc-400 backdrop-blur-lg shadow-2xl text-zinc-600 rounded-lg p-10">
        <form onSubmit={handleSubmit}>
          <h1 className="text-4xl text-center mb-8 font-bold">Login</h1>
          <div className="relative mb-8">
            <input 
              type="email" 
              placeholder="Email"  
              required 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 placeholder:text-zinc-600 bg-transparent border-2 border-zinc-600 rounded-full text-zinc-600 px-6 py-3 outline-none"
            />
            <i className='bx bxs-envelope absolute right-5 top-3 text-xl'></i>
          </div>
          <div className="relative mb-8">
            <input 
              type="password" 
              placeholder="Password" 
              required 
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 bg-transparent text-zinc-600 placeholder:text-zinc-600 border-2 border-zinc-600 rounded-full px-6 py-3 outline-none"
            />
            <i className='bx bxs-lock-alt absolute right-5 top-3 text-xl'></i>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-white" />
              Remember me
            </label>
            <a href="#" className="hover:underline">Forget password?</a>
          </div>
          <button type="submit" className="w-full h-12 bg-white text-zinc-600 font-semibold rounded-full shadow-md hover:bg-gray-200 transition">Login</button>
          <div className="text-center mt-4 text-sm">
            <p>Don't have an account? <a href="/register" className="font-semibold hover:underline">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
