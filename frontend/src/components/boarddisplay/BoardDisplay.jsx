import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';


function BoardDisplay() {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                console.log('Fetching data for boardId:', boardId);
                const boardResponse = await axios.get(`http://localhost:8000/api/v1/boards/${boardId}`);
                setBoard(boardResponse.data.data);

                const postsResponse = await axios.get(`http://localhost:8000/api/v1/boards/${boardId}/posts`);
                setPosts(postsResponse.data.data);
            } catch (error) {
                console.error('Error fetching board data:', error);
            }
        };

        fetchBoardData();
    }, [boardId]);

    if (!board) return <div>Loading...</div>;
    return (
        <div
            className="h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1629654857513-1136aef1b10f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlnaHQlMjBwaW5rJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')"
            }}
        >
            <div className="mx-5 pt-5">
                <div className='p-3 rounded-lg block flex flex-col justify-center text-center'>
                    <h1 className='text-4xl font-bold'>{board.name}</h1>
                    <p className='text-xl font-semibold'>{board.description}</p>
                    <p className='pt-5'>Owner: @{board.user}</p>
                    {board.collaborators && board.collaborators.length > 0 && (
                            <p className="text-md mb-4 font-semibold">
                                Collaborators: {board.collaborators.join(', ')}
                            </p>
                        )}
                    <div className='flex gap-5 justify-center mt-4'>
                        <button className='bg-pink-400 text-white font-semibold py-2 px-4 rounded hover:bg-pink-500 transition duration-300'>
                            Add Collaborators
                        </button>
                    </div>
                </div>

                <div className=''>
                    <div className="flex justify-between items-center my-6 pl-2">
                        <p className="text-xl font-semibold">Your Posts</p>
                    </div>
                    
                    <div className="flex flex-wrap">
                        {posts.map((post) => (
                            <div key={post._id} className="w-full sm:w-1/4 px-2 mb-4">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoardDisplay;
