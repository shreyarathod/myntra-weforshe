import Board  from '../models/board.model.js'; // Adjust the path as necessary
import {User} from '../models/user.model.js'; // Adjust the path as necessary
import postModel from '../models/post.model.js';
import { ApiError } from '../utils/ApiError.js';

export const createBoard = async (req, res, next) => {
  try {
    const user = req.user; // The authenticated user from the middleware

    let collaboratorIds = [];
    if (req.body.collaborators) {
      const collaboratorUsernames = req.body.collaborators.split(',').map(username => username.trim());
      const collaborators = await User.find({ username: { $in: collaboratorUsernames } });
      collaboratorIds = collaborators.map(collaborator => collaborator._id);
    }

    // Create a new board
    const newBoard = await Board.create({
      name: req.body.name,
      description: req.body.description,
      user: user._id, // Associate board with the current user
      collaborators: collaboratorIds // Add collaborator IDs if provided
    });

    // Add the new board to the user's boards array
    user.boards.push(newBoard._id);
    await user.save();

    // Add the new board to each collaborator's boards array if collaborators are provided
    if (collaboratorIds.length > 0) {
      await User.updateMany(
        { _id: { $in: collaboratorIds } },
        { $push: { boards: newBoard._id } }
      );
    }

    res.status(201).json({ message: 'Board created successfully', board: newBoard });
  } catch (err) {
    next(new ApiError(500, 'Error creating board'));
  }
};




export const addCollaborators = async (req, res) => {
  try {
    // Extract boardId and collaborators from request body
    const { boardId, collaborators } = req.body;
    
    // Find the board by its ID
    const board = await Board.findById(boardId);

    // Check if the board exists
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found.' });
    }

    // Check if the authenticated user is the owner of the board
    if (board.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not have permission to add collaborators to this board.' });
    }

    // Extract and trim collaborator usernames from the request body
    const collaboratorUsernames = collaborators.split(',').map(username => username.trim());

    // Find the users based on the usernames
    const collaboratorUsers = await User.find({ username: { $in: collaboratorUsernames } });

    // Extract the collaborator IDs from the found users
    const collaboratorIds = collaboratorUsers.map(collaborator => collaborator._id);

    // Add the collaborators to the board
    board.collaborators.push(...collaboratorIds);
    await board.save();

    // Update the users' boards array
    await User.updateMany(
      { _id: { $in: collaboratorIds } },
      { $push: { boards: boardId } }
    );

    // Respond with success message and updated board data
    res.status(200).json({
      success: true,
      message: 'Collaborators added successfully.',
      data: {
        boardId: board._id,
        collaborators: collaboratorUsernames
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'An error occurred while adding collaborators.' });
  }
};


export const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    // Find the board by ID
    const board = await Board.findById(boardId).populate('user collaborators').exec();
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found.' });
    }

    // Check if the authenticated user is the owner of the board
    if (board.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not have permission to delete this board.' });
    }

    // Remove the board from the user's boards array
    await User.findByIdAndUpdate(req.user._id, { $pull: { boards: boardId } });

    // Remove the board from the collaborators' boards arrays
    await User.updateMany({ _id: { $in: board.collaborators.map(user => user._id) } }, { $pull: { boards: boardId } });

    // Delete all posts associated with the board
    await postModel.deleteMany({ board: boardId });

    // Delete the board
    await Board.findByIdAndDelete(boardId);

    // Send success response
    res.status(200).json({ success: true, message: 'Board deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'An error occurred while deleting the board.' });
  }
};
