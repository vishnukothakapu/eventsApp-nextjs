import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
    },
    profilePic:{
        type:String,
        default:"https://github.com/shadcn.png",
    },
    googleId:{
        type:String,
        unique:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    verifyToken:{
        type:String,
    },
},{timestamps:true});
const UserModel = mongoose.models.User || mongoose.model('User',userSchema);
export default UserModel;