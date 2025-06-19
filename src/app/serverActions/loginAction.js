"use server"
import connectToDB from '../utils/config/db'
import {signIn} from '../auth';
import bcrypt from "bcryptjs";

import User from '../utils/models/User';
export async function loginAction(userDetails){
    await connectToDB();
    try{
        const user = await User.findOne({email:userDetails.email});
        if(!user){
              return { success: false, message: "User not found. Please register." };
        }
        const isPasswordValid = await bcrypt.compare(userDetails.password,user.password);
        if(!isPasswordValid){
            return {success:false,message:"Invalid Password"}
        }
      const response = await signIn("credentials", {
        redirect: false,
        email: userDetails.email,
        password: userDetails.password,
      });
       
        if(response?.error){
            return{success:false,message:response.error||'Login failed.'};
        }
        return { success: true, message: "Login successful",data:response }
      }
    catch(err){
        console.log('Error during login:', err);
        return {success:false,message:err.message||"Login failed. Please try again."}
    }
}