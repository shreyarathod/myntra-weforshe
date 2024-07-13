import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Feedcard() {
  const { postId } = useParams(); // Get postId from the URL params
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log(`Fetching post with ID: ${postId}`);
        const response = await axios.get(`http://localhost:8000/api/v1/posts/${postId}`);
        console.log('Post data:', response.data);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <p>Loading...</p>; // Display a loading message while fetching
  }

  console.log('Post to be rendered:', post);

  return (
    <div className='w-full h-screen pt-5'>
      <div className="w-full max-w-4xl md:h-[70vh] mx-auto bg-slate-200 rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <img
            className="h-full object-cover w-full"
            src={post.image} // Display the fetched post image
            alt={post.title}   // Display the fetched post title
          />
        </div>
        <div className="p-4 md:p-8 w-full md:w-1/2">
          <h1 className="uppercase tracking-wide text-lg text-black font-bold">{post.title}</h1>
          
          <p className="mt-2 text-black">
            {post.description}
          </p>
          
          <hr className="border-gray-400 my-2" />
          
          <div className='flex flex-col md:flex-row justify-between items-center mt-2'>
            <div className='flex flex-row items-center font-semibold text-black'>
              <i className='bx bxs-heart text-lg text-red-500'></i>
              <button className="bg-transparent rounded-full px-2 py-2 hover:bg-transparent transition">
                Like
              </button>
            </div>
            
            <div className="relative group w-full md:w-60 bg-transparent overflow-hidden text-black ">
              <i className='bx bx-chevrons-down absolute right-3 top-3'></i>
              <select
                className="appearance-none cursor-pointer hover:placeholder-shown:bg-emerald-500 relative bg-transparent ring-0 outline-none text-neutral-900 placeholder-violet-700 text-sm font-semibold rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 pl-10"
              >
                <option disabled selected hidden>Add to your Fashionboard</option>
                <option>React</option>
                <option>Vue</option>
                <option>Angular</option>
                <option>Svelte</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <textarea
              className="w-full h-24 p-2 rounded-md text-black bg-gray-100 focus:outline-none focus:ring-blue-300"
              placeholder="Leave a comment..."
            ></textarea>

            <button className="mt-2 bg-pink-200 text-black rounded-full px-4 py-2 hover:bg-pink-300 transition">
              Submit Comment
            </button>
          </div>
        </div>
      </div>

      <div className='mx-5 mt-10'>
        <div className="flex justify-between items-center my-6">
          <p className="text-xl font-semibold">Similar Posts</p>
        </div>
        
        <div className="flex flex-wrap -mx-2">
          {/* Display similar posts */}
          {/* This part can be updated to fetch and display similar posts based on some criteria */}
          { /* Example static similar posts */ }
          <div className="w-full sm:w-1/4 px-2 mb-4">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
              alt="Recent photo"
              className="w-full rounded-lg"
            />
          </div>
          <div className="w-full sm:w-1/4 px-2 mb-4">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
              alt="Recent photo"
              className="w-full rounded-lg"
            />
          </div>
          <div className="w-full sm:w-1/4 px-2 mb-4">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
              alt="Recent photo"
              className="w-full rounded-lg"
            />
          </div>
          <div className="w-full sm:w-1/4 px-2 mb-4">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
              alt="Recent photo"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedcard;
