import React, { useState } from 'react';
import axios from 'axios';
import qs from 'qs';

function MoodboardPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [collaborators, setCollaborators] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !description) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/v1/boards/create-board', qs.stringify({
        name,
        description,
        collaborators: collaborators.split(',').map(collab => collab.trim()).join(','),
      }), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/x-www-form-urlencoded',  // Set the Content-Type header for form-data
        }
      });

      setName('');
      setDescription('');
      setCollaborators('');
      setError('');
      onClose();
    } catch (error) {
      console.error(error.response?.data || error.message);  // Log the error response data or message for debugging
      setError('Failed to create moodboard. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3 relative">
        <i onClick={onClose} className='bx bx-window-close absolute top-4 right-4 text-gray-600 hover:text-gray-900 cursor-pointer'></i>
        <h2 className="text-xl font-semibold mb-4">Create Your Fashionboard</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 text-sm">Title</label>
          <input
            type="text"
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Enter title of the fashionboard"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}  // Update state on change
          />
          <label className="block text-sm text-gray-700">Description</label>
          <textarea
            name='description'
            className="w-full h-24 p-2 mb-3 border border-gray-300 rounded-lg"
            placeholder="Enter fashionboard description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}  // Update state on change
          />

          <label className="block text-gray-700 text-sm">Collaborator</label>
          <input
            type="text"
            name='collaborators'
            className="w-full p-2 border border-gray-300 rounded-lg mb-6"
            placeholder="Write username of the collaborator (if any)"
            value={collaborators}
            onChange={(e) => setCollaborators(e.target.value)}  // Update state on change
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-slate-200 text-black font-semibold py-2 px-4 rounded-lg hover:bg-pink-100"
              onClick={() => setCollaborators('')}  // Clear the collaborators input
            >
              Clear Collaborators
            </button>
            <button
              type="submit"
              className="bg-pink-200 text-black font-semibold py-2 px-4 rounded-lg hover:bg-pink-300"
            >
              Create Moodboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MoodboardPopup;
