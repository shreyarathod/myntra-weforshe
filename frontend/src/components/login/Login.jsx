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
      // Send login data to the server
      const response = await axiosInstance.post('/users/login', { email, password });

      if (response.status === 200) {
        // Redirect to the feed page upon successful login
        navigate('/feed');  // Navigate to /feed after login
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://th.bing.com/th/id/R.0aa75ca8dd35d075642b78c03a928f54?rik=rKNn7O6DctuGEg&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fwp1836740.jpg&ehk=BDzXZSebj0mKsCINhGplmyxLDGLCptGm6%2fFuLBWy9pE%3d&risl=&pid=ImgRaw&r=0')`,
      }}
    >
      <div className="w-[400px] bg-transparent border-2 border-slate-400 backdrop-blur-lg shadow-lg text-white rounded-lg p-10">
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
              className="w-full h-12 bg-transparent border-2 border-slate-400 rounded-full text-white px-6 py-3 outline-none"
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
              className="w-full h-12 bg-transparent border-2 border-slate-400 rounded-full text-white px-6 py-3 outline-none"
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
          <button
            type="submit"
            className="w-full h-12 bg-white text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-200 transition"
          >
            Login
          </button>
          <div className="text-center mt-4 text-sm">
            <p>Don't have an account? <a href="/register" className="font-semibold hover:underline">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
