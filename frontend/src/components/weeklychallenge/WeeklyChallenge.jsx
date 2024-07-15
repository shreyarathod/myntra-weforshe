import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MoodboardPopup from '../userprofile/MoodboardPopup';
import Navbar2 from '../Feed/Navbar2';
import { useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer';
import Typewriter from "typewriter-effect";
import Marquee from "react-fast-marquee";
import "./WeeklyChallenge.css";
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function WeeklyChallenge() {
  const navigate = useNavigate();
  const [results, setResults] = useState({ boards: [], posts: [] });
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const challengeImagesRef = useRef(null);

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

  useEffect(() => {
    if (!challengeImagesRef.current) return;

    const images = gsap.utils.toArray('.challenge_images');
    images.forEach(image => {
      gsap.fromTo(
        image,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          stagger: 0.5,
          scrollTrigger: {
            trigger: image,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
    });
  }, []);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleBoard = (boardId) => () => {
    navigate(`/board/${boardId}`);
  };

  return (
    <>
      <Navbar2 />
      <div className="w-full h-full flex flex-col bg-[url('https://images.unsplash.com/photo-1629654857513-1136aef1b10f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlnaHQlMjBwaW5rJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')] bg-no-repeat bg-cover">
        {/* Overlay */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-20 flex items-center justify-center">
            <div className="relative z-50">
              <MoodboardPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`relative ${isPopupOpen ? 'filter blur-sm pointer-events-none' : ''}`}>
          <div className='flex flex-col mt-16 text-center backdrop-blur-xl justify-center items-center mx-5 py-5 bg-transparent px-5 rounded-lg'>
            <div className='mx-10'>
              <h1 className='bona-nova-sc-regular-500 text-7xl font-semibold pb-2 mb-6'>Design Divas: Weekly Style Showdown</h1>
              <p className='mb-1 text-2xl space-grotesk-uniquifier'>Ready to wow us with your fashion board masterpiece and win some of our exclusive coupons?</p>
              <p className='mb-4 text-2xl space-grotesk-uniquifier'>Create a stunning fashion board on the theme</p>
              <h2 className='bona-nova-sc-regular-500 text-5xl font-semibold mb-12 mt-8'>
                <Typewriter
                  options={{
                    strings: ['Y2K Revival'],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </h2>
            </div>
            <button
              onClick={handleOpenPopup}
              className="group mt-6 space-grotesk-uniquifier group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-left hover:decoration-2 hover:text-rose-400 relative bg-white border-slate-300 h-16 w-96 border-2 text-left p-3 text-zinc-600 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
            >
              Start Creating ...
            </button>
          </div>
          <Marquee
            pauseOnHover={true}
            direction="left"
            speed={50}
            style={{ width: '100%', whiteSpace: 'nowrap' }}
          >
            <div className="flex space-x-10 mt-8 mb-12 p-4 text-2xl space-grotesk-uniquifier font-semibold text-gray-400">
              <p className="hover:text-pink-600 transition-colors duration-300">Low-rise Jeans</p>
              <p className="hover:text-pink-600 transition-colors duration-300">Crop Tops</p>
              <p className="hover:text-pink-600 transition-colors duration-300">Mini-Skirts</p>
              <p className="hover:text-pink-600 transition-colors duration-300">Halter Tops</p>
              <p className="hover:text-pink-600 transition-colors duration-300">Chunky Sneakers</p>
              <p className="hover:text-pink-600 transition-colors duration-300">Bandanas</p>
              <p className="hover:text-pink-600 transition-colors duration-300">Butterfly Clips</p>
              <p className="hover:text-pink-600 transition-colors duration-300">Rhine Stones</p>
            </div>
          </Marquee>
          
          <div className="bg-white mx-5 my-10 p-5 pb-2 rounded-2xl">
            <div className='bg-transparent mx-5 rounded-lg text-center py-4 mt-10'>
              <h2 className='bona-nova-sc-regular-500 text-4xl text-pink-400'>Want some Inspiration? Check out last week's entries for "Cottage Core"</h2>
            </div>

            <div ref={challengeImagesRef} className="flex mx-5 my-10 space-x-5">
              <div className="w-1/2 h-[700px] bg-white flex flex-col justify-center items-center rounded-lg overflow-hidden">
                <h1 className='text-2xl space-grotesk-uniquifier h-16 mt-5'>Winner</h1>
                <div className='h-full w-full overflow-hidden px-2 pb-2'>
                  {!loading && results.boards.length > 0 && results.boards[0].posts.length > 0 && (
                    <img onClick={handleBoard(results.boards[0]._id)} src={results.boards[0].posts[0].image} alt="Fashion item" className='opacity-0 challenge_images object-cover w-full h-full rounded-lg' />
                  )}
                </div>
              </div>
              <div className="w-1/2 h-[700px] bg-white flex flex-col justify-center items-center rounded-lg overflow-hidden">
                <h1 className='text-2xl space-grotesk-uniquifier font-bold h-16 mt-5'>Some Top Fashionboards</h1>
                <div className="h-full w-full grid grid-cols-2 grid-rows-2 gap-2 rounded-lg overflow-hidden px-2 pb-2">
                  {!loading && results.boards.slice(1, 5).map((board, index) => (
                    board.posts.length > 0 && (
                      <div key={index}><img onClick={handleBoard(board._id)} src={board.posts[0].image} alt={`Fashion item ${index + 1}`} className='opacity-0 challenge_images w-full h-full object-cover rounded-md' /></div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default WeeklyChallenge;
