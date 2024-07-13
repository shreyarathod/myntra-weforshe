import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true  // Ensure the user field is required
  },
  name: {
    type: String,
    required: true  // Ensure the name field is required
  },
  description: {
    type: String,
    default: ''  // Set a default value for description
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });  // Add timestamps for createdAt and updatedAt

const Board = mongoose.model('Board', BoardSchema);
export default Board;
