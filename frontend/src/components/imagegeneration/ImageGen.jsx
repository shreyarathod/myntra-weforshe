import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../cards/Card';
import style from '../cards/Card.module.css'; 
import { imagegen_card1, imagegen_card2, imagegen_card3, imagegen_card4 } from '../../../utils/index.js';
import Navbar from '../navbar/Navbar.jsx';

const ImageGen = () => {
  const [prompt, setPrompt] = useState(''); // State for the prompt
  const [imageUrls, setImageUrls] = useState([]); // State for the array of image URLs
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  // Define the fetchBoards function
  const fetchBoards = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access Token:', accessToken); // Log the token for debugging
  
      const response = await axios.get('http://localhost:8000/api/v1/users/boards', {
        headers: {
          'Authorization': `Bearer ${accessToken}`  // Include the access token
        }
      });
  
      // Log the entire response for debugging
      console.log('API Response:', response);
  
      // Access the boards from response.data.data
      const boards = response.data.data;
      console.log('Fetched Boards:', boards); // Ensure boards are present
      if (boards.length > 0) {
        setBoards(boards);
      } else {
        console.error('No boards found');
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
      alert(`Error fetching boards: ${error.response ? error.response.data.message : error.message}`);
    }
  };
  

  const generateImage = async () => {
    if (!prompt) {
      alert('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/generate-image', { prompt, boardId: selectedBoard });
      console.log('Received image URLs:', response.data.imageUrls);
      if (response.data.imageUrls && response.data.imageUrls.length > 0) {
        setImageUrls(response.data.imageUrls);
      } else {
        throw new Error('Image URLs are undefined or empty');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert(`Error generating image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardChange = (event) => {
    setSelectedBoard(event.target.value);
  };

  return (
    <>
    <Navbar/>
    <div className="p-5 bg-[url('https://images.unsplash.com/photo-1629654857513-1136aef1b10f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlnaHQlMjBwaW5rJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')] min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">AI Image Generator</h1>
      <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-300 w-full max-w-screen-xl">
        {/* Prompt and Generate Image Section */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            className="flex-1 h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button
            onClick={generateImage}
            disabled={loading}
            className={`h-12 px-4 bg-pink-400 text-white font-semibold rounded-md shadow-md hover:bg-pink-500 hover:text-white transition ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {/* Display Generated Images */}
        {imageUrls.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Generated Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  <img
                    src={url}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-auto max-w-full border border-gray-300 rounded-md"
                  />
                  <div className="relative group w-full bg-gray-50 overflow-hidden mt-2 bg-gray-50 overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-0 before:bg-violet-500 before:rounded-full before:blur-lg before:[box-shadow:-60px_20px_10px_10px_#F9B0B9]">
                    <svg
                      y="0"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0"
                      width="100"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid meet"
                      height="100"
                      className="w-8 h-8 absolute right-0 -rotate-45 stroke-pink-300 top-1.5 group-hover:rotate-0 duration-300 pointer-events-none"
                    >
                      <path
                        strokeWidth="4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="none"
                        d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
                        className="svg-stroke-primary"
                      ></path>
                    </svg>
                    <select
                      value={selectedBoard}
                      onChange={handleBoardChange}
                      className="appearance-none relative text-pink-400 bg-transparent ring-0 outline-none border border-neutral-500 text-neutral-900 text-sm font-bold rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
                    >
                      <option disabled hidden value="">Add to Moodboard</option>
                      {boards.map((board) => (
                        <option key={board._id} value={board._id}>{board.name}</option> // Display board._id for now, change to a more meaningful property if available
                      ))}
                    </select>
                  </div> 
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display Cards in the Same Line */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Explore Ideas</h2>
          <div className={style.cardContainer}>
            <Card 
              image={imagegen_card1} 
              para="cropped camisole top with cargo pants in a utility style, accessorized with a chain belt and combat boots" 
            />
            <Card 
              image={imagegen_card2} 
              para="cropped sweater vest over a collared shirt, paired with pleated trousers and loafers, accessorized with round glasses and a crossbody bag" 
            />
            <Card 
              image={imagegen_card3} 
              para="cropped hoodie with high-waisted jogger pants" 
            />
            <Card 
              image={imagegen_card4} 
              para="loose-fit graphic t-shirt and ripped jeans outfit in vintage wash" 
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default ImageGen;
