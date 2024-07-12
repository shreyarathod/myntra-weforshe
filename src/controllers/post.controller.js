import postModel from '../models/post.model.js';
import boardModel from '../models/board.model.js';

export const createPost = async (req, res, next) => {
  try {
    const user = req.user; // Extract the authenticated user from the request
    const boardId = req.body.board; // Get the selected board ID from the form

    // Create a new post
    const post = await postModel.create({
      board: boardId,
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename // Get the uploaded file's filename
    });

    // Find the board and push the new post into its posts array
    const board = await boardModel.findById(boardId);
    if (!board) {
      // Handle the case where the board is not found
      throw new Error('Board not found');
    }

    board.posts.push(post._id);
    await board.save();

    // res.redirect(`/show/posts/${boardId}`);
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
    const board = await boardModel.findById(post.board).populate('user').exec();
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found.' });
    }

    // Check if the authenticated user is the owner of the board
    if (board.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not have permission to delete this post.' });
    }

    // Remove the post from the board's posts array
    await boardModel.findByIdAndUpdate(post.board, { $pull: { posts: postId } });

    // Delete the post
    await postModel.findByIdAndDelete(postId);

    // Send success response
    res.status(200).json({ success: true, message: 'Post deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'An error occurred while deleting the post.' });
  }
};

