import express from 'express';
import verifyJWT from '../middleware/auth.middleware.js';
import {createBoard, addCollaborators, deleteBoard} from '../controllers/board.controller.js';

const router = express.Router();

router.post('/create-board', verifyJWT, createBoard);
router.post('/addcollaborators', verifyJWT, addCollaborators);

router.delete('/delete-board/:boardId', verifyJWT, deleteBoard);

export default router;
