import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async(userId) =>{
   try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken
       await user.save({ validateBeforeSave: false })

       return {accessToken, refreshToken}


   } catch (error) {
       throw new ApiError(500, "Something went wrong while generating referesh and access token")
   }
}


export const registerUser = asyncHandler(async (req,res) =>{
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

export const loginUser = asyncHandler(async (req, res) =>{
   // req body -> data
   // username or email
   //find the user
   //password check
   //access and referesh token
   //send cookie

   const {email, password} = req.body
   console.log(email);

   if (!email) {
       throw new ApiError(400, " email is required")
   }
   
   // Here is an alternative of above code based on logic discussed in video:
   // if (!(username || email)) {
   //     throw new ApiError(400, "username or email is required")
       
   // }

   const user = await User.findOne({email})

   if (!user) {
       throw new ApiError(404, "User does not exist")
   }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
   throw new ApiError(401, "Invalid user credentials")
   }

  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
       httpOnly: true,
       secure: true
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
       new ApiResponse(
           200, 
           {
               user: loggedInUser, accessToken, refreshToken
           },
           "User logged In Successfully"
       )
   )

})


export const logoutUser = asyncHandler(async(req, res) => {
   await User.findByIdAndUpdate(
       req.user._id,
       {
           $unset: {
               refreshToken: 1 // this removes the field from document
           }
       },
       {
           new: true
       }
   )

   const options = {
       httpOnly: true,
       secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User logged Out"))
})


export const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

