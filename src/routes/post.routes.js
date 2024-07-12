import express from 'express';
import verifyJWT from '../middleware/auth.middleware.js'; // Import your existing verifyJWT middleware
import {upload} from '../middleware/multer.middleware.js'; // Middleware for handling file uploads
import { createPost, deletePost } from '../controllers/post.controller.js';

const router = express.Router();

// Define the route and link it to the controller method
router.post('/create-post', verifyJWT, upload.single('image'), createPost);
router.delete('/delete-post/:postId', verifyJWT, deletePost);

export default router;
