import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MoodboardPopup from '../userprofile/MoodboardPopup';
import Navbar from '../navbar/Navbar';
import { useNavigate } from 'react-router-dom';

function WeeklyChallenge() {
    
    const navigate = useNavigate();
    
    const [results, setResults] = useState({ boards: [], posts: [] });
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const weeklyChallenge = "pink";
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/search?query=${weeklyChallenge}`);
            setResults(response.data.data);
          } catch (error) {
            console.error('Error fetching search results:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [weeklyChallenge]);
    
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };
    const handleBoard = (boardId) => () => {
        navigate(`/board/${boardId}`);  
    };

  return (
    <>
    <Navbar/>
    <div className="w-full h-full flex flex-col bg-[url('https://images.unsplash.com/photo-1629654857513-1136aef1b10f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlnaHQlMjBwaW5rJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')] bg-no-repeat bg-cover">
      <div className='flex justify-around mx-5 pt-5 rounded-md mt-4'>
        <h1 className='text-4xl font-semibold'>Weekly Challenge</h1>
      </div>
      <div className='flex flex-row backdrop-blur-xl justify-center items-center mx-5 mt-10 py-5 bg-transparent px-5 rounded-lg'>
        <div className='mx-10'>
          <h1 className='text-2xl font-semibold pb-2'>Design Divas: Weekly Style Showdown</h1>
          <p>Step into Success: Redefine Your Professional Style, Elevate Your Presence, and Command Your Career with Confidence!</p>
          <p>Winners will receive exciting gift vouchers during the Myntra Sale!</p>
        </div>
        <button 
          onClick={handleOpenPopup}
          className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-left hover:decoration-2 hover:text-rose-400 relative bg-white border-slate-300 h-16 w-96 border-2 text-left p-3 text-zinc-600 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
        >
          Start Creating ...
        </button>
        <MoodboardPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
      </div>
      <div className="flex mx-5 my-10 space-x-5">
        <div className="w-1/2 h-[700px] bg-white flex flex-col justify-center items-center rounded-lg overflow-hidden">
          <h1 className='text-2xl font-bold h-16 mt-5'>Last Week's Winner</h1>
          <div className='h-full w-full overflow-hidden px-2 pb-2'>
            {!loading && results.boards.length > 0 && results.boards[0].posts.length > 0 && (
              <img onClick={handleBoard(results.boards[0]._id)} src={results.boards[0].posts[0].image} alt="Fashion item" className='object-cover w-full h-full rounded-lg' />
            )}
          </div>
        </div>
        <div className="w-1/2 h-[700px] bg-white flex flex-col justify-center items-center rounded-lg overflow-hidden">
          <h1 className='text-2xl font-bold h-16 mt-5'>Some top Fashionboards</h1>
          <div className="h-full w-full grid grid-cols-2 grid-rows-2 gap-2 rounded-lg overflow-hidden px-2 pb-2">
            {!loading && results.boards.slice(1, 5).map((board, index) => (
              board.posts.length > 0 && (
                <div key={index}><img onClick={handleBoard(board._id)}src={board.posts[0].image} alt={`Fashion item ${index + 1}`} className='w-full h-full object-cover rounded-md' /></div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default WeeklyChallenge;
