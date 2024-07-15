import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar2 from '../Feed/Navbar2';
import Footer from '../footer/Footer';

function BoardDisplay() {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [posts, setPosts] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [ownerUsername, setOwnerUsername] = useState('');

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                console.log('Fetching data for boardId:', boardId);
                const boardResponse = await axios.get(`http://localhost:8000/api/v1/boards/${boardId}`);
                setBoard(boardResponse.data.data);
                console.log(board);

                // Fetch posts data
                const postsResponse = await axios.get(`http://localhost:8000/api/v1/boards/${boardId}/posts`);
                setPosts(postsResponse.data.data);
                console.log(posts);

                // Fetch the owner username
                const ownerResponse = await axios.get(`http://localhost:8000/api/v1/users/${boardResponse.data.data.user}`);
                setOwnerUsername(ownerResponse.data.data.username);

                // Fetch usernames for collaborators
                const collaboratorIds = boardResponse.data.data.collaborators;
                if (collaboratorIds.length > 0) {
                    const usernamesResponse = await Promise.all(collaboratorIds.map(id => axios.get(`http://localhost:8000/api/v1/users/${id}`)));
                    const usernamesMap = usernamesResponse.reduce((acc, response) => {
                        acc[response.data.data._id] = response.data.data.username;
                        return acc;
                    }, {});
                    setUsernames(usernamesMap);
                }
            } catch (error) {
                console.error('Error fetching board data:', error);
            }
        };

        fetchBoardData();
    }, [boardId]);

    const handlePostRedirection = (postId) => () => {
        navigate(`/post/${postId}`);  
    };

    if (!board) return <div>Loading...</div>;

    return (
        <>
        <Navbar2/>
        <div
            className="h-full bg-cover bg-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1629654857513-1136aef1b10f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlnaHQlMjBwaW5rJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')"
            }}
        >
            <div className="mx-auto w-full pt-10 px-5 bg-transparent rounded-lg shadow-lg">
                <div className='text-center'>
                    <h1 className='text-5xl font-bold bona-nova-sc-regular-500  text-gray-800'>{board.name}</h1>
                    <p className='text-xl space-grotesk-uniquifier-bold font-semibold text-gray-600 mt-2'>{board.description}</p>
                    <p className='text-md text-gray-500 mt-2'>Owner: @{ownerUsername}</p> {/* Display the owner’s username */}
                    {board.collaborators && board.collaborators.length > 0 && (
                        <p className="text-md text-gray-500 mb-4">
                            <span className="font-semibold space-grotesk-uniquifier-bold">Collaborators:</span> {board.collaborators.map(id => usernames[id]).join(', ')}
                        </p>
                    )}
                    <div className='mt-6'>
                        <button className='bg-pink-400 text-white font-semibold py-2 px-4 rounded hover:bg-pink-500 transition duration-300'>
                            Add Collaborators
                        </button>
                    </div>
                </div>

                <div className='mt-10'>
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-3xl font-semibold bona-nova-sc-regular-500 text-gray-800">Your Posts</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                        {posts.map((post) => (
                            <div key={post._id} className="w-full h-96 bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out">
                                <img
                                    onClick={handlePostRedirection(post._id)}
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
}

export default BoardDisplay;
