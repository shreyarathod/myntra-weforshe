import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const navigate = useNavigate();  // Initialize useNavigate

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if (avatar) formData.append('avatar', avatar);
    if (coverImage) formData.append('coverImage', coverImage);

    try {
      // Send registration data to the server
      const response = await axiosInstance.post('/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        // Redirect to the login page upon successful registration
        navigate('/login');  // Ensure this redirect happens
      } else {
        console.error('Registration failed');
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
      <div className="w-[450px] bg-transparent border-2 border-slate-400 backdrop-blur-lg shadow-lg text-white rounded-lg p-10">
        <form onSubmit={handleSubmit}>  {/* Attach handleSubmit */}
          <h1 className="text-4xl text-center mb-8 font-bold">Register</h1>
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Full Name"
              required
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-12 placeholder:text-white/70 bg-transparent border-2 border-slate-400 rounded-full text-white px-6 py-3 outline-none"
            />
            <i className="bx bx-user-pin absolute right-5 top-3 text-xl"></i>
          </div>
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Username"
              required
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 placeholder:text-white/70 bg-transparent border-2 border-slate-400 rounded-full text-white px-6 py-3 outline-none"
            />
            <i className="bx bxs-user absolute right-5 top-3 text-xl"></i>
          </div>
          <div className="relative mb-5">
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 placeholder:text-white/70 bg-transparent border-2 border-slate-400 rounded-full text-white px-6 py-3 outline-none"
            />
            <i className="bx bxs-envelope absolute right-5 top-3 text-xl"></i>
          </div>
          <div className="relative mb-5">
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 placeholder:text-white/70 bg-transparent border-2 border-slate-400 rounded-full text-white px-6 py-3 outline-none"
            />
            <i className="bx bxs-lock-alt absolute right-5 top-3 text-xl"></i>
          </div>
          <div className="relative mb-5">
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="avatar"
              className="w-full h-12 text-white/70 bg-transparent border-2 border-slate-400 rounded-full text-white px-6 py-3 outline-none flex items-center justify-center cursor-pointer"
            >
              Select Avatar
            </label>
          </div>
          <div className="relative mb-5">
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="coverImage"
              className="w-full h-12 text-white/70 bg-transparent border-2 border-slate-400 rounded-full text-white px-6 py-3 outline-none flex items-center justify-center cursor-pointer"
            >
              Select Cover Image
            </label>
          </div>
          <button
            type="submit"
            className="w-full h-12 mt-5 bg-white text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-200 transition"
          >
            Create an Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
