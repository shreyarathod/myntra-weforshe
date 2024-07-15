import React from 'react';
import Navbar2 from './Navbar2.jsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Footer from '../footer/Footer.jsx';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

function Feed() {
  const challengeImagesRef = useRef(null);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
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

  useEffect(() => {
    gsap.to('.feed_headings', {
      opacity: 1,
      delay: 1,
      stagger: 0.5,
    });

    if (!challengeImagesRef.current) return;

    const rows = document.querySelectorAll('.row');
    rows.forEach(row => {
      gsap.fromTo(
        row.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.3,
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
    });
  }, [posts]);

  const getRandomPosts = (posts, count) => {
    const shuffled = [...posts].sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Return the first 'count' items from the shuffled array
  };

  const randomPosts = getRandomPosts(posts, posts.length);

  const handleImageGen = () => {
    navigate('/image-gen');
  };

  const handlePostRedirection = (postId) => () => {
    navigate(`/post/${postId}`);
  };

  const groupPostsIntoRows = (posts, itemsPerRow) => {
    const rows = [];
    for (let i = 0; i < posts.length; i += itemsPerRow) {
      rows.push(posts.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const rowsOfPosts = groupPostsIntoRows(randomPosts, 4); // Adjust itemsPerRow as needed

  return (
    <div>
      <Navbar2 />
      <div className="w-full h-full bg-no-repeat bg-cover flex flex-col bg-[url('https://images.unsplash.com/photo-1629654857513-1136aef1b10f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlnaHQlMjBwaW5rJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')]">
        <div className="flex flex-col mx-auto text-center justify-around py-5 rounded-md mt-4">
          <h1 className="feed_headings opacity-0 bona-nova-sc-regular-500 text-5xl font-semibold mb-4 mt-10">Fashion Board AI Generator : Elevate Your Fashion</h1>
          <p className="feed_headings opacity-0 space-grotesk-uniquifier text-xl font-medium mb-10">Got any ideas you'd like to bring to life? Head over to our design generator now!</p>
          <button onClick={handleImageGen} className="feed_headings opacity-0 group bona-nova-sc-regular-400 mx-auto group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-left hover:decoration-2 hover:text-rose-500 relative bg-white border-slate-300 h-16 w-96 border-2 text-left p-3 text-zinc-600 text-xl font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-0 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-0 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
            AI Design Generator
          </button>
        </div>
        <div className="feed_headings opacity-0 flex w-5/6 justify-around items-center mx-5 mt-10 py-5 bg-white px-5 rounded-lg mx-auto">
          <div className="w-1/2">
            <h1 className="text-4xl bona-nova-sc-bold">Loved the look?</h1>
            <p className="text-md text-xl space-grotesk-uniquifier">
              Now you can shop items directly from the FashionBoard
            </p>
          </div>
          <div className="w-2/3 flex justify-around">
            <a href="https://www.myntra.com/blazers/boohoo/boohoo-matte-satin-tailored-cropped-blazer/25320252/buy" target="_blank" rel="noopener noreferrer" className="w-1/3 h-48 mx-2">
              <div className="h-full overflow-hidden rounded-lg">
                <img src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/25320252/2023/10/26/103df4cc-664e-408e-a65d-8a968ff5b4131698304962633-Boohoo-Matte-Satin-Tailored-Cropped-Blazer-1581698304962394-1.jpg" alt="" className="object-cover h-full w-full" />
              </div>
            </a>
            <a href="https://www.myntra.com/trousers/sassafras/sassafras-women-black-high-rise-bootcut-trousers/20717712/buy" target="_blank" rel="noopener noreferrer" className="w-1/3 h-48 mx-2">
              <div className="h-full rounded-lg bg-cover object-cover overflow-hidden">
                <img src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/20717712/2023/1/17/28c7a830-4f47-40f6-bbb4-46bc62ddd90c1673947837762-SASSAFRAS-Women-Black-High-Rise-Bootcut-Trousers-25616739478-1.jpg" alt="" className="object-cover h-full w-full" />
              </div>
            </a>
            <a href="https://www.myntra.com/waistcoat/deebaco/deebaco-v-neck-sleeveless-slim-fit-waistcoat/26260698/buy" target="_blank" rel="noopener noreferrer" className="w-1/3 h-48 mx-2">
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/26260698/2023/12/5/441919dc-c400-4b27-86a9-3cb5134cb9451701768505273WineWomensWaistCoat6.jpg" alt="" className="object-cover h-full w-full" />
              </div>
            </a>
          </div>
        </div>
        <div ref={challengeImagesRef} className="mx-5 mt-5 p-4 bg-transparent shadow-none rounded-lg">
          <div className="flex justify-center mb-12 mt-8">
            <p className="text-4xl bona-nova-sc-regular-500 font-semibold">Latest Designs</p>
          </div>

          {rowsOfPosts.length > 0 ? (
            rowsOfPosts.map((row, rowIndex) => (
              <div key={rowIndex} className="row flex flex-wrap justify-center gap-8 mb-8"> {/* Added row class */}
                {row.map((post) => (
                  <div key={post._id} className="feed_images w-full shadow-none h-72 sm:w-1/5 px-2 overflow-hidden rounded-lg"> {/* Smaller height and width for internal div */}
                    <img
                      onClick={handlePostRedirection(post._id)}
                      src={post.image} // Make sure imageUrl is valid and accessible
                      alt={post.title} // Ensure that title exists
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Feed;
