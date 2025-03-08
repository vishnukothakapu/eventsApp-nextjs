import mongoose from "mongoose";
let isConnected = false;
const connectToDB=async()=>{
    if (isConnected) return;
try{
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("Connected to Database");
}
catch(err){
    console.log(err);
    throw new Error('Database connection failed');
}
}
export default connectToDB;