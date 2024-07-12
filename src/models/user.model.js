import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            lowercase:true,
            unique:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            unique:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        avatar:{
            type:String, //url
        },
        coverImage:{
            type:String, //url
        },
        password:{
            type:String,
            required:[true, "Password is a required field!"],
        },
        refreshToken:{
            type:String,
        },
        boards: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Board'
          }],
          likedBoards: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Board'
          }]
    },
    {
        timestamps:true
    }
)


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // Pass errors to the next middleware
    }
});

userSchema.methods.isPasswordCorrect = async function (password){
    return  await bcrypt.compare(password, this.password);

}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            username: this.username,
            email : this.email,
            fullName : this.fullName
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id : this._id,    
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)