import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar2 from './Navbar2';
import { useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');
  const [results, setResults] = useState({ boards: [], posts: [] });
  const [loading, setLoading] = useState(true);

    const handleBoard = (boardId) => () => {
        navigate(`/board/${boardId}`);  
    };


    const handlePostRedirection = (postId) => () => {
        navigate(`/post/${postId}`);
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/search?query=${query}`);
        setResults(response.data.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar2 />
      <div className="bg-white min-h-screen p-5">
        <div className="container mx-auto">
          <h1 className="text-4xl bona-nova-sc-regular-400 font-bold mb-6 text-gray-900">Search Results</h1>
          
          <div className="p-6  mb-10 rounded-lg bg-pink-50">
            <h2 className="text-3xl bona-nova-sc-regular-400 font-semibold mb-4 text-gray-800">Posts</h2>
            {results.posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.posts.map(post => (
                  <div key={post._id} className="bg-white rounded-lg shadow-md p-3">
                    <img
                      onClick={handlePostRedirection(post._id)}  
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-md mb-1"
                    />
                    {/* <h3 className="text-xl font-semibold space-grotesk-uniquifier-bold text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-gray-700 space-grotesk-uniquifier">{post.description}</p> */}
                  </div>
                ))}
              </div>
            ) : (
              <p>No posts found</p>
            )}
          </div>
          <div className=" bg-pink-100 p-6 rounded-lg">
            <h2 className="text-3xl font-semibold mb-4 bona-nova-sc-regular-400 text-gray-800">Boards</h2>
            {results.boards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.boards.map(board => (
                  <div key={board._id} className="bg-white rounded-lg shadow-md p-4">
                    {board.posts.length > 0 && (
                      <img
                      onClick={handleBoard(board._id)}
                        src={board.posts[0].image}
                        alt={board.name}
                        className="w-full h-64 object-cover rounded-md mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold space-grotesk-uniquifier-bold text-gray-800 mb-2">{board.name}</h3>
                    <p className="text-gray-700 space-grotesk-uniquifier">{board.description}</p>
                    
                  </div>
                ))}
              </div>
            ) : (
              <p>No boards found</p>
            )}
          </div>

        </div>
      </div>
      <Footer/>
    </>
  );
}

export default SearchResults;