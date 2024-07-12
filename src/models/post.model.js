import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
  },
  title: String,
  description: String,
  image: String,
});

const postModel = mongoose.model('Post', postSchema);
export default postModel;
