"use server";
import connectToDB from "../utils/config/db";
import User from '../utils/models/User';
import {auth} from '../auth';

export async function profileAction() {
    await connectToDB();
    try {
        const session = await auth();
        if(!session||!session.user || !session.user.id){
            return {success:false,error:"Invalid session.User not logged in"};
        }
        const userId = session.user.id;
        const userData = await User.findById(userId);
        if(!userData){
            return {success:false,error:"User not found"};
        }
        let userDoc = JSON.parse(JSON.stringify(userData));
        console.log("User Details:",userDoc);
        console.log("User Joined Date:",userDoc.createdAt);
        return {success:true,userDoc};
    }
    catch(err){
        console.error('Error fetching data:',err);
        return {success:false,error:"An error occurred while fetching the profile. Please try again"};
    }
};