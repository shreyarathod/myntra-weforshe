import { Router } from 'express';
import {
    togglePostLike,     // Updated from toggleVideoLike
    toggleBoardLike,   // Added for board likes
    toggleCommentLike,
    getLikedBoards,
    getLikeStatus     // Updated from getLikedVideos
} from "../controllers/like.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Toggle like on a post
router.post("/posts/:postId/like", togglePostLike);

// Toggle like on a board
router.post("/boards/:boardId/like", toggleBoardLike);

// Toggle like on a comment
router.post("/comments/:commentId/like", toggleCommentLike);

// Get all liked boards for the authenticated user
router.get("/users/me/liked-boards", getLikedBoards);

router.get('/posts/:postId/status', getLikeStatus);

export default router;
