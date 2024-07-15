import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MoodboardPopup from './MoodboardPopup.jsx';
import Postboard from './Postboard.jsx';
import Navbar2 from '../Feed/Navbar2.jsx';
import Footer from '../footer/Footer.jsx';

function UserProfile() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPostboardOpen, setIsPostboardOpen] = useState(false);
    const [moodboards, setMoodboards] = useState([]);
    const [userDetails, setUserDetails] = useState({ fullname: '', username: '', coverImage: '', avatar: '' });
    const navigate = useNavigate();

    // Function to open the Moodboard Popup
    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    // Function to open the Postboard
    const handleOpenPostboard = () => {
        setIsPostboardOpen(true);
    };

    // Function to close the Moodboard Popup
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    // Function to close the Postboard
    const handleClosePostboard = () => {
        setIsPostboardOpen(false);
    };

    // Function to navigate to the Image Generation page
    const handleImageGen = () => {
        navigate('/image-gen');
    };

    // Fetch user details and moodboards
    const fetchUserDetails = async () => {
        try {
            const userResponse = await axios.get('http://localhost:8000/api/v1/users/current-user', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });

            setUserDetails({
                fullname: userResponse.data.data.fullName,
                username: userResponse.data.data.username,
                coverImage: userResponse.data.data.coverImage,
                avatar: userResponse.data.data.avatar,
            });

            // Fetch moodboards after getting user details
            const moodboardsResponse = await axios.get('http://localhost:8000/api/v1/users/boards', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });

            if (Array.isArray(moodboardsResponse.data.data)) {
                // Fetch posts for each board
                const moodboardsWithPosts = await Promise.all(moodboardsResponse.data.data.map(async (board) => {
                    try {
                        const postsResponse = await axios.get(`http://localhost:8000/api/v1/boards/${board._id}/posts`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                            }
                        });

                        // Attach posts to each moodboard
                        return {
                            ...board,
                            posts: postsResponse.data.data,
                        };
                    } catch (error) {
                        console.error(`Error fetching posts for board ${board._id}:`, error);
                        return board; // Return the board even if there was an error fetching posts
                    }
                }));

                setMoodboards(moodboardsWithPosts);
            } else {
                console.error('Invalid moodboards data format:', moodboardsResponse.data.data);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    // Function to handle board click
    const handleBoard = (boardId) => () => {
        navigate(`/board/${boardId}`);  
    };

    return (
        <>
            <Navbar2 />
            <div className={`min-h-screen bg-gray-100 ${isPostboardOpen || isPopupOpen ? 'overflow-hidden' : ''}`}>
                <div className="w-full">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="bg-[url('https://images.unsplash.com/photo-1629654857513-1136aef1b10f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlnaHQlMjBwaW5rJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')] bg-no-repeat bg-cover text-black p-6 flex flex-col items-center">
                            <img
                                src={userDetails.avatar}
                                alt="User profile"
                                className="rounded-full border-2 border-white w-32 h-32 object-cover mb-4"
                            />
                            <h5 className="text-4xl bona-nova-sc-regular-400 font-semibold">{userDetails.fullname}</h5>
                            <p className="text-black">@{userDetails.username}</p>
                        </div>

                        <div className="p-6 text-black">
                            <div className='flex flex-row justify-around pt-10 mb-5'>
                                <button
                                    onClick={handleImageGen}
                                    className="space-grotesk-uniquifier group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-left hover:decoration-2 hover:text-rose-400 relative bg-white h-16 w-96 border-2 border-slate-300 text-left p-3 text-zinc-600 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1  before:bg-violet-500 before:rounded-full before:blur-lg after:absolute  after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
                                >
                                    Generate AI Design
                                </button>
                                <button
                                    onClick={handleOpenPostboard}
                                    className="space-grotesk-uniquifier group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-left hover:decoration-2 hover:text-rose-400 relative bg-white h-16 w-96 border-2 border-slate-300 text-left p-3 text-zinc-600 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1  before:bg-violet-500 before:rounded-full before:blur-lg after:absolute  after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
                                >
                                    Create Post
                                </button>
                                <button
                                    onClick={handleOpenPopup}
                                    className="group space-grotesk-uniquifier group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur origin-left hover:decoration-2 hover:text-rose-400 relative bg-white border-slate-300 h-16 w-96 border-2 text-left p-3 text-zinc-600 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1  before:bg-violet-500 before:rounded-full before:blur-lg after:absolute  after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
                                >
                                    Create Fashionboard
                                </button>
                            </div>
                            <div className="w-full flex justify-center items-center mb-12 mt-12">
                                <p className="text-4xl mt-6 font-semibold bona-nova-sc-regular-400 text-center">Your Fashion Boards</p>
                            </div>
                            <div className="flex flex-wrap gap-16 justify-center ">
                                {moodboards.map((board) => (
                                    <div
                                        key={board._id}
                                        className={`w-[calc(25%-1rem)] h-96 bg-gray-200 border border-gray-300 rounded-xl overflow-hidden ${isPostboardOpen ? 'opacity-50' : ''}`}
                                    >
                                        {board.posts && board.posts.length > 0 ? (
                                            <div
                                                onClick={handleBoard(board._id)}
                                                className={`w-full h-3/4 bg-cover bg-center relative cursor-pointer ${isPostboardOpen ? 'blur-sm' : ''}`}
                                                style={{ backgroundImage: `url(${board.posts[0]?.image})` }}
                                            >
                                                {/* Optional overlay if you want */}
                                                {/* <div className="bg-black bg-opacity-50 h-full flex items-center justify-center text-white text-sm">{board.posts[0].title}</div> */}
                                            </div>
                                        ) : (
                                            <div className="w-full h-3/4 flex items-center justify-center text-gray-600 text-sm">
                                                No Posts
                                            </div>
                                        )}
                                        <div className="w-full space-grotesk-uniquifier h-1/4 bg-gray-100 flex items-center justify-center text-center text-gray-800 text-lg font-semibold px-2 py-1">
                                            {board.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {isPostboardOpen && (
                    <>
                        <div className="modal-overlay" onClick={handleClosePostboard}></div>
                        <Postboard isOpen={isPostboardOpen} onClose={handleClosePostboard} />
                    </>
                )}
                {isPopupOpen && (
                    <>
                        <div className="modal-overlay" onClick={handleClosePopup}></div>
                        <MoodboardPopup className='z-10' isOpen={isPopupOpen} onClose={handleClosePopup} />
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}

export default UserProfile;
