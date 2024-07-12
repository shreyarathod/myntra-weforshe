import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getCommentsByPostId, // Changed from getVideoComments to match post functionality
    updateComment
} from "../controllers/comment.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);  // Apply verifyJWT middleware to all routes in this file

// Get all comments for a specific post
router.route('/:postId')
    .get(getCommentsByPostId)  // Changed to get comments by post ID
    .post(addComment);

// Delete or update a specific comment by ID
router.route('/c/:commentId')
    .delete(deleteComment)
    .patch(updateComment);

export default router;
