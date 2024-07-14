import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import postModel from "../models/post.model.js";
import Board from "../models/board.model.js"; 
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Toggle like on a post
const togglePostLike = async (req, res) => {
    try {
      const { postId } = req.params;
      const { _id: userId } = req.user;
  
      // Validate post ID
      if (!isValidObjectId(postId)) {
        throw new ApiError(400, 'Invalid post ID');
      }
  
      // Check if the user has already liked the post
      const existingLike = await Like.findOne({ post: postId, likedBy: userId });
  
      if (existingLike) {
        // Remove the like
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new ApiResponse(200, {}, 'Like removed from post'));
      } else {
        // Add a new like
        await Like.create({ post: postId, likedBy: userId });
        return res.status(201).json(new ApiResponse(201, {}, 'Like added to post'));
      }
    } catch (error) {
      console.error(error);
      res.status(500).json(new ApiResponse(500, {}, 'An error occurred while toggling like'));
    }
  };




// Toggle like on a board
const toggleBoardLike = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const { _id: userId } = req.user;

    // Validate board ID
    if (!isValidObjectId(boardId)) {
        throw new ApiError(400, "Invalid board ID");
    }

    // Check if the user has already liked the board
    const existingLike = await Like.findOne({ board: boardId, likedBy: userId });

    if (existingLike) {
        // Remove the like
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new ApiResponse(200, {}, "Like removed from board"));
    } else {
        // Add a new like
        await Like.create({ board: boardId, likedBy: userId });
        return res.status(201).json(new ApiResponse(201, {}, "Like added to board"));
    }
});

// Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { _id: userId } = req.user;

    // Validate comment ID
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Check if the user has already liked the comment
    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

    if (existingLike) {
        // Remove the like
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new ApiResponse(200, {}, "Like removed from comment"));
    } else {
        // Add a new like
        await Like.create({ comment: commentId, likedBy: userId });
        return res.status(201).json(new ApiResponse(201, {}, "Like added to comment"));
    }
});

// Get all liked boards for the authenticated user
const getLikedBoards = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;

    // Find all boards liked by the user
    const likedBoards = await Like.find({ likedBy: userId, board: { $ne: null } })
        .populate('board')
        .exec();

    return res.status(200).json(new ApiResponse(200, likedBoards, "Liked Boards retrieved successfully"));
});

const getLikeStatus = async (req, res) => {
  const { postId } = req.params;
  const { _id: userId } = req.user;

  if (!postId) {
    throw new ApiError(400, 'Post ID is required');
  }

  try {
    const like = await Like.findOne({ post: postId, likedBy: userId });

    if (like) {
      return res.status(200).json({ liked: true });
    } else {
      return res.status(200).json({ liked: false });
    }
  } catch (error) {
    throw new ApiError(500, 'Failed to fetch like status');
  }
};



export {
    togglePostLike,
    toggleBoardLike, // Corrected name
    toggleCommentLike,
    getLikedBoards,
    getLikeStatus
};
