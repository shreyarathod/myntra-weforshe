import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';

function Feedcard() {
  const { postId } = useParams(); // Get postId from the URL params
  const [post, setPost] = useState(null);
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [liked, setLiked] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [posts, setPosts] = useState([]);
  const commentsContainerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/posts/allposts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const getRandomPosts = (posts, count) => {
    const shuffled = [...posts].sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Return the first 'count' items from the shuffled array
  };

  const randomPosts = getRandomPosts(posts, 8);

  const handlePostRedirection = (postId) => () => {
    navigate(`/post/${postId}`);
  };

  // Fetch post details and like status
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/posts/${postId}`);
        setPost(response.data);
        fetchLikeStatus();  // Check if the post is liked
        fetchComments(1);   // Fetch initial comments
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  console.log(post);

  // Fetch boards for the select dropdown
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/v1/users/boards', {
          headers: {
            'Authorization': `Bearer ${accessToken}`  // Include the access token
          }
        });

        const boards = response.data.data;
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

    fetchBoards();
  }, []);

  // Fetch like status for the post
  const fetchLikeStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/likes/posts/${postId}/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

  // Fetch comments for the post
  const fetchComments = async (page) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/comments/${postId}?page=${page}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const newComments = response.data.data.docs;

      if (newComments.length === 0) {
        setHasMoreComments(false);
      } else {
        setComments((prevComments) => {
          // Filter out duplicate comments based on the comment ID
          const existingCommentIds = new Set(prevComments.map(comment => comment._id));
          const uniqueNewComments = newComments.filter(comment => !existingCommentIds.has(comment._id));
          return [...prevComments, ...uniqueNewComments];
        });
        setCommentPage(page);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;

    try {
      await axios.post(`http://localhost:8000/api/v1/comments/${postId}`, { content: commentContent }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setCommentContent('');
      setComments([]);
      setCommentPage(1);
      setHasMoreComments(true);
      fetchComments(1);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  // Handle board selection and create post automatically
  const handleBoardChange = async (event) => {
    const boardId = event.target.value;
    setSelectedBoard(boardId);

    try {
      await axios.post('http://localhost:8000/api/v1/posts/create-post-with-url', {
        board: boardId,
        title: post.title,
        description: post.description,
        imageUrl: post.image,  // Use imageUrl instead of file
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

  // Load more comments when the user scrolls to the bottom
  const handleScroll = useCallback(() => {
    if (!commentsContainerRef.current) return;

    const container = commentsContainerRef.current;
    const bottom = container.scrollHeight === container.scrollTop + container.clientHeight;

    if (bottom && hasMoreComments) {
      fetchComments(commentPage + 1);
    }
  }, [commentPage, hasMoreComments]);

  // Set up and clean up the scroll event listener
  useEffect(() => {
    const commentsContainer = commentsContainerRef.current;

    if (commentsContainer) {
      commentsContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (commentsContainer) {
        commentsContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  // Toggle like status for the post
  const handleLikeToggle = async () => {
    try {
      const result = await toggleLike(postId);
      setLiked(!liked);
      console.log(result.message);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const toggleLike = async (postId) => {
    const url = `http://localhost:8000/api/v1/likes/posts/${postId}/like`;
    const token = localStorage.getItem('accessToken'); // Assuming you're using token-based auth

    try {
      const response = await axios.post(url, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        console.log(response.data.message);
        return response.data;
      } else {
        throw new Error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  };

  if (!post) {
    return <p>Loading...</p>; // Display a loading message while fetching
  }

  return (
    <>
      <Navbar />
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
                <div
                  className="bg-transparent rounded-full px-2 py-2 hover:bg-transparent transition flex gap-1 items-baseline cursor-pointer"
                  onClick={handleLikeToggle}
                >
                  <i className={`bx ${liked ? 'bxs-heart' : 'bx-heart'} text-lg ${liked ? 'text-red-500' : 'text-black'}`}></i>
                  {liked ? 'Unlike' : 'Like'}
                </div>
              </div>
              <div className="relative group w-full md:w-60 bg-transparent overflow-hidden text-black">
                <i className='bx bx-chevrons-down absolute right-3 top-3'></i>
                <select
                  value={selectedBoard}
                  onChange={handleBoardChange}
                  className="appearance-none cursor-pointer hover:placeholder-shown:bg-emerald-500 relative bg-transparent ring-0 outline-none text-neutral-900 placeholder-violet-700 text-sm font-semibold rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 pl-10"
                >
                  <option disabled hidden value="">Add to Moodboard</option>
                  {boards.map((board) => (
                    <option key={board._id} value={board._id}>{board.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <textarea
                className="w-full h-24 p-2 rounded-md text-black bg-gray-100 focus:outline-none focus:ring-blue-300"
                placeholder="Leave a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              ></textarea>
              <button
                className="mt-2 bg-pink-200 text-black rounded-full px-4 py-2"
                onClick={handleCommentSubmit}
              >
                Comment
              </button>
            </div>
            <div className="mt-4 space-y-4 max-h-96 overflow-y-auto" ref={commentsContainerRef}>
              {comments.map((comment) => (
                <div key={comment._id} className="p-2 bg-white rounded-md shadow-sm">
                  <p className="font-semibold text-black">{comment.owner?.username || 'Anonymous'}</p>  {/* Display username or "Anonymous" */}
                  <p>{comment.content}</p>
                </div>
              ))}
              {!hasMoreComments && <p className="text-gray-500">No more comments to load</p>}
            </div>
          </div>
        </div>
        <div className='mx-5 mt-10'>
          <div className="flex justify-between items-center my-6">
            <p className="text-xl font-semibold">See More Posts</p>
          </div>
          <div className="flex flex-wrap -mx-2">
            {randomPosts.length > 0 ? (
              randomPosts.map((post) => (
                <div key={post._id} className="w-full h-64 sm:w-1/4 px-2 mb-4 overflow-hidden">
                  <img
                    onClick={handlePostRedirection(post._id)}
                    src={post.image} // Make sure imageUrl is valid and accessible
                    alt={post.title}    // Ensure that title exists
                    className="w-full rounded-lg object-cover h-full cursor-pointer"  // Added cursor-pointer for better UX
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

export default Feedcard;
