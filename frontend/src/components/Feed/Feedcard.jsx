import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';

function Feedcard() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [liked, setLiked] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [posts, setPosts] = useState([]);
  const [posts2, setPosts2] = useState([]);
  const [board, setBoard] = useState(null);
  const commentsContainerRef = useRef(null);
  const navigate = useNavigate();

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
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const randomPosts = getRandomPosts(posts, 8);

  const handlePostRedirection = (postId) => () => {
    navigate(`/post/${postId}`);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/posts/${postId}`);
        setPost(response.data);
        fetchLikeStatus();
        fetchComments(1);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

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

  const handleBoardChange = async (event) => {
    const boardId = event.target.value;
    console.log(boardId);
    setSelectedBoard(boardId);

    if (post) {
      try {
        const formData = new FormData();
        formData.append('board', boardId);
        formData.append('title', post.title);
        formData.append('description', post.description);
        formData.append('image', post.image);

        await axios.post('http://localhost:8000/api/v1/posts/create-post-with-url', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        alert('Post created successfully!');
        setSelectedBoard('');
      } catch (error) {
        console.error('Failed to create post:', error);
        alert(`Failed to create post: ${error.response ? error.response.data.message : error.message}`);
      }
    }
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/v1/users/boards', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
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

  useEffect(() => {
    if (post && post.board) {
      const fetchBoardData = async () => {
        try {
          console.log('Fetching data for boardId:', post.board);
          const boardResponse = await axios.get(`http://localhost:8000/api/v1/boards/${post.board}`);
          setBoard(boardResponse.data.data);
          console.log('Board data:', boardResponse.data.data);

          const postsResponse = await axios.get(`http://localhost:8000/api/v1/boards/${post.board}/posts`);
          setPosts2(postsResponse.data.data);
          console.log('Board posts:', postsResponse.data.data);
        } catch (error) {
          console.error('Error fetching board data:', error);
        }
      };

      fetchBoardData();
    }
  }, [post]);

  const handleScroll = useCallback(() => {
    if (!commentsContainerRef.current) return;

    const container = commentsContainerRef.current;
    const bottom = container.scrollHeight === container.scrollTop + container.clientHeight;

    if (bottom && hasMoreComments) {
      fetchComments(commentPage + 1);
    }
  }, [commentPage, hasMoreComments]);

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
    const token = localStorage.getItem('accessToken');

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
      console.error(error);
      throw error;
    }
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className='w-full h-screen pt-5'>
        <div className="w-full max-w-4xl md:h-[70vh] mx-auto bg-slate-200 rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            <img
              className="h-full object-cover w-full"
              src={post.image}
              alt={post.title}
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
                  <p className="font-semibold text-black">{comment.owner?.username || 'Anonymous'}</p>
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
            {posts2.length > 0 ? (
              posts2.map((post) => (
                <div key={post._id} className="w-full h-64 sm:w-1/4 px-2 mb-4 overflow-hidden">
                  <img
                    onClick={handlePostRedirection(post._id)}
                    src={post.image}
                    alt={post.title}
                    className="w-full rounded-lg object-cover h-full cursor-pointer"
                  />
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
          <div className="flex justify-between items-center my-6">
            <p className="text-xl font-semibold">See More Posts</p>
          </div>
          <div className="flex flex-wrap -mx-2">
            {randomPosts.length > 0 ? (
              randomPosts.map((post) => (
                <div key={post._id} className="w-full h-64 sm:w-1/4 px-2 mb-4 overflow-hidden">
                  <img
                    onClick={handlePostRedirection(post._id)}
                    src={post.image}
                    alt={post.title}
                    className="w-full rounded-lg object-cover h-full cursor-pointer"
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
