import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res) =>{
   //get user details from frontend 
   //validation- not empty
   //check if user already exists
   //check for images
   //upload them to cloudinary
   //create user object - entry in db
   //remove password and refresh token field from response
   //check for user creation
   //return res


   const {username, fullName, email, password} = req.body
   console.log(email)
   if ([username,fullName,email,password].some(field=>field?.trim() ==="")) { 
        throw new ApiError(400, "All fields are required")
   } 

   const userExists =  await User.findOne({
    $or : [{username}, {email}]
   })

   if(userExists){
    throw new ApiError(409, "User with email or username alreeady userExists.")
   }

   // const avatarLocalPath = req.files?.avatar[0]?.path
   // const coverImageLocalPath = req.files?.coverImage[0]?.path
   let avatarLocalPath;
   if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
      avatarLocalPath = req.files.avatar[0].path
   }

   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
      coverImageLocalPath = req.files.coverImage[0].path
   }



   //if you want to make avatar a required field

   // if(!avatarLocalPath){
   //    throw new ApiError(400, "Avatar file required.")
   // }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   // if(!avatar){
   //    throw new ApiError(400, "Avatar file required.")
   // }

   const user = await User.create(
      {
         fullName,
         username: username,
         password,
         email,
         avatar: avatar?.url || "",
         coverImage: coverImage?.url || ""

      }
   )

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if(!createdUser){
      throw new ApiError(404, "something went wrong while registering the user.")
   }

   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered successfully!!")
   )


})

export default registerUser