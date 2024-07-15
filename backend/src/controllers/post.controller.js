import postModel from '../models/post.model.js';
import Board from '../models/board.model.js';
import { ApiError } from '../utils/ApiError.js';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the filename of the current module
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = path.dirname(__filename);



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
      image: uploadResponse.url,
      tags:[] 
    });

    // Find the board and push the new post into its posts array
    const board = await Board.findById(boardId);
    if (!board) {
      // Handle the case where the board is not found
      throw new Error('Board not found');
    }

    board.posts.push(post._id);
    await board.save();

    extractTagsInBackground(req.body.description, post._id);

    res.status(201).json({ message: 'Post created successfully', post: post });
  } catch (err) {
    console.error(err);
    next(err); // Forward the error to the error handling middleware
  }
};

async function extractTagsInBackground(description, postId) {
  try {
    const scriptPath = path.join(__dirname, '../scripts/tag_extractor.py');
    exec(`python ${scriptPath} "${description}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error extracting tags: ${error}`);
        return;
      }
      const tags = stdout.trim().split(',');

      // Update post with extracted tags
      await postModel.findByIdAndUpdate(postId, { tags: tags });

      console.log('Tags extracted and updated for post:', postId);
    });
  } catch (err) {
    console.error('Error in background tag extraction:', err);
  }
}





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
    const post = await postModel.findById(postId).select('image title description tags').exec(); // Include 'tags' to pass to Python script

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const scriptPath = path.join(__dirname, '../scripts/products.py');
    const outputFilePath = path.join(__dirname, '../scripts/products_output.json');
    console.log(`python ${scriptPath} "${post.tags.join(',')}"`);

    const fetchProducts = new Promise((resolve, reject) => {
      exec(`python ${scriptPath} "${post.tags.join(',')}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error.message);
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return reject(stderr);
        }

        fs.readFile(outputFilePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading output file: ${err}`);
            return reject('Error reading output file');
          }
          let products;
          try {
            products = JSON.parse(data).slice(0, 10); // Limit to 10 products
            resolve(products);
          } catch (err) {
            console.error(`Error parsing JSON: ${err}`);
            reject('Error parsing response');
          }
        });
      });
    });

    const products = await fetchProducts;
    res.status(200).json({ post, products });
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
      image: imageUrl,
      tags:[]  
    });

    const postboard = await Board.findById(board);
    if (!postboard) {
      // Handle the case where the board is not found
      throw new Error('Board not found');
    }

    postboard.posts.push(newPost._id);
    await postboard.save();

    extractTagsInBackground(req.body.description, newPost._id);

    res.status(201).json({ message: 'Post created successfully!', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


