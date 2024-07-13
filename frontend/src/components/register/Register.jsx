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
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const navigate = useNavigate();

  const handleAvatarChange = (event) => {
    setAvatarFile(event.target.files[0]);
    setAvatar(event.target.files[0]);
  };

  const handleCoverImageChange = (event) => {
    setCoverImageFile(event.target.files[0]);
    setCoverImage(event.target.files[0]);
  };

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
      const response = await axiosInstance.post('/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        navigate('/login');
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1559762705-2123aa9b467f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
      <div className="w-[450px] bg-transparent border-2 border-slate-400 backdrop-blur-lg shadow-xl text-zinc-600 rounded-lg p-10">
        <form onSubmit={handleSubmit}>
          <h1 className="text-4xl text-center mb-8 font-bold">Register</h1>
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Full Name"
              required
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-12 placeholder:text-zinc-600 bg-transparent border-2 text-zinc-600 border-zinc-600 rounded-full text-zinc-600 px-6 py-3 outline-none"
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
              className="w-full h-12 placeholder:text-zinc-600 bg-transparent border-2 border-zinc-600 text-zinc-600 rounded-full px-6 py-3 outline-none"
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
              className="w-full h-12 placeholder:text-zinc-600 bg-transparent border-2 border-zinc-600 text-zinc-600 rounded-full  px-6 py-3 outline-none"
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
              className="w-full h-12 placeholder:text-zinc-600 bg-transparent border-2 border-zinc-600 text-zinc-600 rounded-full px-6 py-3 outline-none"
            />
            <i className="bx bxs-lock-alt absolute right-5 top-3 text-xl"></i>
          </div>
          <div className="relative mb-5">
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <label
              htmlFor="avatar"
              className="w-full h-12 text-zinc-600 bg-transparent border-2 border-zinc-600 rounded-full px-6 py-3 outline-none flex items-center justify-center cursor-pointer"
            >
              {avatarFile ? avatarFile.name : 'Select Avatar'}
            </label>
          </div>
          <div className="relative mb-5">
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleCoverImageChange}
              className="hidden"
            />
            <label
              htmlFor="coverImage"
              className="w-full h-12 text-zinc-600 bg-transparent border-2 border-zinc-600 rounded-full px-6 py-3 outline-none flex items-center justify-center cursor-pointer"
            >
              {coverImageFile ? coverImageFile.name : 'Select Cover Image'}
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
