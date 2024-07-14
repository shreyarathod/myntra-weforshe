
import mongoose, {Schema} from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


commentSchema.plugin(mongoosePaginate); 

export const Comment = mongoose.model("Comment", commentSchema)
