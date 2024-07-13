import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Replicate from 'replicate';


const app = express();
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend URL
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true  // Allow credentials
  }));

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

app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body; // Get the prompt from the request body

  if (!prompt) {
    return res.status(400).send('Prompt is required');
  }

  try {
    // Debugging: Log the request data
    console.log('Received prompt:', prompt);

    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f",
      {
        input: {
          width: 920,
          height: 1096,
          prompt: `human wearing ${prompt}`, // Use the prompt from the request body
          scheduler: "K_EULER",
          num_outputs: 4,  // Generate 4 images
          guidance_scale: 0,
          negative_prompt: "worst quality, low quality",
          num_inference_steps: 4
        }
      }
    );

    // Debugging: Log the response data
    console.log('Generated image URLs:', output);

    if (!output || output.length === 0) {
      throw new Error('No image URLs returned from Replicate.');
    }

    res.json({ imageUrls: output }); // Send the image URLs as response
  } catch (error) {
    // Debugging: Log the error details
    console.error('Error generating image:', error.message);
    res.status(500).send(`Error generating image: ${error.message}`);
  }
});



export { app }