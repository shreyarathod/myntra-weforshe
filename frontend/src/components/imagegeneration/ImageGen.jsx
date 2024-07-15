import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../cards/Card';
import style from '../cards/Card.module.css'; 
import { imagegen_card1, imagegen_card2, imagegen_card3, imagegen_card4 } from '../../../utils/index.js';
import Navbar2 from '../Feed/Navbar2.jsx';
import Footer from '../footer/Footer.jsx';
import Postboard2 from './PostBoard2.jsx';

const ImageGen = () => {
  const [prompt, setPrompt] = useState(''); // State for the prompt
  const [imageUrls, setImageUrls] = useState([]); // State for the array of image URLs
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [isPostboardOpen, setIsPostboardOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');  // State for the current image URL

  const handleOpenPostboard = (url) => {
    setCurrentImageUrl(url);  // Set the current image URL
    setIsPostboardOpen(true); // Open the Postboard
  };

  // Function to close the Postboard
  const handleClosePostboard = () => {
    setIsPostboardOpen(false);
  };

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
      <Navbar2 />
      <div className="p-5 bg-[url('https://images.unsplash.com/photo-1629654857513-1136aef1b10f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlnaHQlMjBwaW5rJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')] min-h-screen flex flex-col items-center">
        <h1 className="text-4xl font-bold  bona-nova-sc-regular-500  mb-6 text-gray-900">AI Design Generator</h1>
        <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-300 w-full max-w-screen-xl">
          {/* Prompt and Generate Image Section */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              className="flex-1 space-grotesk-uniquifier h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button
              onClick={generateImage}
              disabled={loading}
              className={`h-12 px-4 space-grotesk-uniquifier bg-pink-400 text-white font-semibold rounded-md shadow-md hover:bg-pink-500 hover:text-white transition ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </div>

          {/* Display Generated Images */}
          {imageUrls.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold bona-nova-sc-regular-500 mb-2 text-gray-900">Generated Images</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex flex-col gap-4 items-center w-full">
                    <img
                      src={url}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-auto max-w-full border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={() => handleOpenPostboard(url)} 
                      className="group space-grotesk-uniquifier group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-left hover:decoration-2 hover:text-rose-400 relative bg-white h-12 w-full border-2 border-slate-300 text-left p-3 text-zinc-600 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1  before:bg-violet-500 before:rounded-full before:blur-lg after:absolute  after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg pt-4"
                    >
                      Create Post
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display Cards in the Same Line */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2 bona-nova-sc-regular-500 text-gray-900">Explore Ideas</h2>
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

      {/* Pass the currentImageUrl as a prop to Postboard2 */}
      <Postboard2 
        isOpen={isPostboardOpen} 
        onClose={handleClosePostboard} 
        imageUrl={currentImageUrl} 
      />
      <Footer/>
    </>
  );
}

export default ImageGen;
