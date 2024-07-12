
import mongoose, {Schema} from "mongoose";


const likeSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "postModel"
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: "Board"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
}, {timestamps: true})

export const Like = mongoose.model("Like", likeSchema)
