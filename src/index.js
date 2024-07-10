// require('dotenv').config({path : './env'});
import dotenv from 'dotenv';
import connectDB from "./db/index.js";

import { app } from './app.js'; 



dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log("error:", error);
        throw error;
    })

    app.listen(process.env.PORT || 8000, ()=>{
        console.log("Listening at port: ", process.env.PORT);

    })
})
.catch((error)=>{
    console.log("MongoDB connection failed.", error);
})























// ;(async() =>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error" , (error)=>{
//             console.log("Error occured :", error);
//             throw error;
//         }) 

//         app.listen(process.env.PORT, ()=>{
//             console.log(`port listening at: ${process.env.PORT}` )
//         })
//     }catch(error){

//         console.log("Error:" , error);
//         throw error;
//     }
// })()