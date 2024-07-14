import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Postboard2({ isOpen, onClose, imageUrl }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(imageUrl);  // Set initial value from the prop
  const [selectedBoard, setSelectedBoard] = useState('');
  const [error, setError] = useState('');
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8000/api/v1/users/boards', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setBoards(response.data.data);
    } catch (error) {
      console.error('Error fetching boards:', error);
      alert(`Error fetching boards: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !description || !selectedBoard) {
      setError('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);  // The image URL field
    formData.append('board', selectedBoard);

    try {
      await axios.post('http://localhost:8000/api/v1/posts/create-post-with-url', {
        board: selectedBoard,
        title: title,
        description: description,
        imageUrl:image,  // Use imageUrl instead of file
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'  // Set content type to JSON
        }
      });

      alert('Post created successfully!');
      setSelectedBoard('');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert(`Failed to create post: ${error.response ? error.response.data.message : error.message}`);
    }
  };

    


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3 relative">
        <i onClick={onClose} className='bx bx-window-close absolute top-4 right-4 text-gray-600 hover:text-gray-900 cursor-pointer'></i>
        <h2 className="text-xl font-semibold mb-4">Create Your Post</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 text-sm">Title</label>
          <input
            type="text"
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Enter title of the post"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="block text-sm text-gray-700">Description</label>
          <textarea
            name='description'
            className="w-full h-24 p-2 mb-3 border border-gray-300 rounded-lg"
            placeholder="Enter post description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="block text-sm text-gray-700">Select Board</label>
          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          >
            <option value="" disabled>Select a board</option>
            {boards.map((board) => (
              <option key={board._id} value={board._id}>{board.name}</option>
            ))}
          </select>
          <label className="block text-gray-700 text-sm">Image URL</label>
          <input
            type="text"
            name='image'
            className="w-full p-2 border border-gray-300 rounded-lg mb-6"
            placeholder="Enter image URL"
            value={image}  // Set value from state
            onChange={(e) => setImage(e.target.value)}  // Update state on change
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-pink-200 text-black font-semibold py-2 px-4 rounded-lg hover:bg-pink-300"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Postboard2;
