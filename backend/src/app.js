import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from 'passport';




const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(cookieParser());
app.use(express.urlencoded({extended: true,limit:"16kb"}))
app.use(express.json({limit:"16kb"}))
app.use(express.static("public"))


app.get('/test', (req, res) => {
    res.send('Test endpoint hit');
});


import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter)

import boardRouter from "./routes/board.routes.js";
app.use("/api/v1/boards", boardRouter)

import postRouter from "./routes/post.routes.js";
app.use("/api/v1/posts", postRouter)

import likeRoutes from "./routes/like.routes.js";
app.use('/api/v1/likes', likeRoutes);

import commentRoutes from "./routes/comment.routes.js";
app.use('/api/v1/comments', commentRoutes);

export { app }