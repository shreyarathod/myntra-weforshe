import { Comment } from '../models/comment.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Post from '../models/post.model.js';
import { isValidObjectId } from 'mongoose';

// Add a comment to a post
export const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { _id: userId } = req.user;

  // Validate post ID
  if (!postId) {
    throw new ApiError(400, 'Post ID is required');
  }

  // Check if the post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  // Create a new comment
  const comment = await Comment.create({
    post: postId,
    content,
    author: userId
  });

  // Respond with success message and the new comment data
  res.status(201).json(new ApiResponse(201, comment, 'Comment added successfully'));
});

// Update a comment
export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const { _id: userId } = req.user;

  // Validate comment ID
  if (!commentId) {
    throw new ApiError(400, 'Comment ID is required');
  }

  // Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  // Check if the user is the author of the comment
  if (comment.author.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not authorized to update this comment');
  }

  // Update the comment
  comment.content = content;
  await comment.save();

  // Respond with success message and the updated comment data
  res.status(200).json(new ApiResponse(200, comment, 'Comment updated successfully'));
});

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        // Validate comment ID
        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, 'Invalid comment ID');
        }

        // Delete the comment
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            throw new ApiError(404, 'Comment not found');
        }

        return res.status(200).json(new ApiResponse(200, {}, 'Comment deleted successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, {}, 'An error occurred while deleting comment'));
    }
};


// Get all comments for a specific post
export const getCommentsByPostId = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Validate post ID
  if (!postId) {
    throw new ApiError(400, 'Post ID is required');
  }

  // Get comments for the post
  const comments = await Comment.find({ post: postId })
    .populate('owner', 'username')  // Populate the author field to include username
    .exec();

  // Respond with success message and the comments data
  res.status(200).json(new ApiResponse(200, comments, 'Comments retrieved successfully'));
});
