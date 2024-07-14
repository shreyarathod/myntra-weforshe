

import React from 'react';
import Navbar2 from './Navbar2.jsx';
import { useNavigate,  } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';


function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // Fetch posts from the API
  const [error, setError] = useState(null); // Added state to manage errors

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/posts/allposts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts'); // Set error state if fetching fails
      }
    };

    fetchPosts();
  }, []);

  console.log(posts);

  const getRandomPosts = (posts, count) => {
    const shuffled = [...posts].sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Return the first 'count' items from the shuffled array
  };
  
  const randomPosts = getRandomPosts(posts, 8);
  console.log(randomPosts)

    const handleImageGen = () => {
      navigate('/image-gen');  
    };

    const handlePostRedirection = (postId) => () => {
      navigate(`/post/${postId}`);  
  };

 


  return (
    
    <>
    <Navbar2/>
    <div className="w-full  flex flex-col bg-[url('https://images.unsplash.com/photo-1629654857513-1136aef1b10f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlnaHQlMjBwaW5rJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')]">
      <div className=' flex justify-around  mx-5 py-5 rounded-md mt-4'>
        <h1 className='text-4xl font-semibold'>Elevate Your Fashion</h1>
        <button onClick={handleImageGen} className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-left hover:decoration-2 hover:text-rose-400 relative bg-white border-slate-300 h-16 w-96 border-2 text-left p-3 text-zinc-600 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-0 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-0 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
          Generate AI design
        </button>
      </div>
      <div className=' flex justify-around items-center mx-5 mt-10 py-5 bg-white px-5 rounded-lg'>
        <div className='w-1/2'>
        <h1 className='text-3xl font-bold'>Loved the look?</h1>
          <p className='text-md text-xl'>
            Now you can shop items directly from the FashionBoard
          </p>
        </div>
        <div className='w-2/3 flex justify-around'>
            <a href='https://www.myntra.com/blazers/boohoo/boohoo-matte-satin-tailored-cropped-blazer/25320252/buy'  target='_blank' rel='noopener noreferrer'  className='w-1/3 h-48 mx-2'>
            <div className=' h-full overflow-hidden rounded-lg'>
                <img src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/25320252/2023/10/26/103df4cc-664e-408e-a65d-8a968ff5b4131698304962633-Boohoo-Matte-Satin-Tailored-Cropped-Blazer-1581698304962394-1.jpg" alt="" className='object-cover h-full w-full' />
            </div>
            </a>
            <a href='https://www.myntra.com/trousers/sassafras/sassafras-women-black-high-rise-bootcut-trousers/20717712/buy' target='_blank' rel='noopener noreferrer' className='w-1/3 h-48 mx-2'>
            <div className='h-full rounded-lg bg-cover  object-cover overflow-hidden'>
                <img src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/20717712/2023/1/17/28c7a830-4f47-40f6-bbb4-46bc62ddd90c1673947837762-SASSAFRAS-Women-Black-High-Rise-Bootcut-Trousers-25616739478-1.jpg" alt="" className='object-cover h-full w-full' />
            </div>
            </a>
            <a href='https://www.myntra.com/waistcoat/deebaco/deebaco-v-neck-sleeveless-slim-fit-waistcoat/26260698/buy' target='_blank' rel='noopener noreferrer' className='w-1/3 h-48 mx-2'>
            <div className='w-full h-full rounded-lg overflow-hidden'>
                <img src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/26260698/2023/12/5/441919dc-c400-4b27-86a9-3cb5134cb9451701768505273WineWomensWaistCoat6.jpg" alt="" className='object-cover h-full w-full'/>
            </div>
            </a>
      </div>
    </div>
    <div className='mx-5 mt-5'>
    <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-semibold">All Designs</p>
              
            </div>
            
            
            <div className="flex flex-wrap -mx-2">
            {randomPosts.length > 0 ? (
              randomPosts.map((post) => (
                <div key={post._id} className="w-full h-64 sm:w-1/4 px-2 mb-4 overflow-hidden">
                  <img
                  onClick={handlePostRedirection(post._id)}
                    src={post.image} // Make sure imageUrl is valid and accessible
                    alt={post.title}    // Ensure that title exists
                    className="w-full rounded-lg object-cover h-full"
                  />
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>

    </div>
    
    </>
  );
}

export default Feed;

