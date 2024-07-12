import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY , 
    api_secret:  process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
      throw new ApiError(400, "No file path provided for upload.");
  }

  try {
      const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: 'auto'
      });

      // Log the URL of the uploaded file
      console.log("File uploaded to Cloudinary URL:", response.url);

      // Delete the file from local server after successful upload
      fs.unlinkSync(localFilePath);

      return response;
  } catch (error) {
      // Ensure local file is deleted in case of an error
      if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
      }
      console.error("Cloudinary upload error:", error);
      throw new ApiError(500, "Error uploading file to Cloudinary.");
  }
};

  
export {uploadOnCloudinary}