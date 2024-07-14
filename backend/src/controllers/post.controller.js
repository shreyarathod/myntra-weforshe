import postModel from '../models/post.model.js';
import Board from '../models/board.model.js';
import { ApiError } from '../utils/ApiError.js';



import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const createPost = async (req, res, next) => {
  try {
    const user = req.user; // Extract the authenticated user from the request
    const boardId = req.body.board; // Get the selected board ID from the form

    // Upload the file to Cloudinary
    const localFilePath = req.file.path; // Get the local file path
    const uploadResponse = await uploadOnCloudinary(localFilePath);

    // Create a new post with the Cloudinary URL
    const post = await postModel.create({
      board: boardId,
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: uploadResponse.url, // Use the Cloudinary URL
    });

    // Find the board and push the new post into its posts array
    const board = await Board.findById(boardId);
    if (!board) {
      // Handle the case where the board is not found
      throw new Error('Board not found');
    }

    board.posts.push(post._id);
    await board.save();

    res.status(201).json({ message: 'Post created successfully', post: post });
  } catch (err) {
    console.error(err);
    next(err); // Forward the error to the error handling middleware
  }
};



export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by ID
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    // Find the board associated with the post
    const board = await Board.findById(post.board).populate('user').exec();
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found.' });
    }

    // Check if the authenticated user is the owner of the board
    if (board.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not have permission to delete this post.' });
    }

    // Remove the post from the board's posts array
    await Board.findByIdAndUpdate(post.board, { $pull: { posts: postId } });

    // Delete the post
    await postModel.findByIdAndDelete(postId);

    // Send success response
    res.status(200).json({ success: true, message: 'Post deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'An error occurred while deleting the post.' });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    // Fetch posts and only include _id, imageUrl, and title fields
    const posts = await postModel.find().select('_id image title').exec();
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId).select('image title description').exec(); // Select fields you want to return

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createPostWithUrl = async (req, res) => {
  try {
    const { board, title, description, imageUrl } = req.body;

    // Check if all fields are provided
    if (!board || !title || !description || !imageUrl) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create the post
    const newPost = await postModel.create({
      board,
      title,
      description,
      image: imageUrl  // Use imageUrl instead of file path
    });

    res.status(201).json({ message: 'Post created successfully!', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


