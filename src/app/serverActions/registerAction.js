"use server";
import connectToDB from '../utils/config/db';
import User from '../utils/models/User';
import {nanoid} from 'nanoid';
import bcrypt from 'bcryptjs';
import path from 'path';
import upload from '../utils/config/fileUpload';
import {writeFile,mkdir} from 'fs/promises';
import {fileURLToPath} from "url";
export async function registerAction(formData){
    await connectToDB();
    try{
        const email = formData.get("email");
        const name = formData.get("name");
        const password = formData.get("password");
        const profilePic = formData.get("profilePic");
        if(!email||!name||!password){
            throw new Error("Name,email and password are required");
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            throw new Error("A user with email already exists");
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const token = nanoid(32);
        let profilePicPath=null;
        if(profilePic){
            const bufferData = await profilePic.arrayBuffer();
            const buffer = Buffer.from(bufferData);
            const uploadsDir = path.join(process.cwd(),"public","uploads");
            await mkdir(uploadsDir,{recursive:true});
            const filename = path.basename(profilePic.name);
            profilePicPath=path.join(uploadsDir,filename);
            await writeFile(profilePicPath,buffer);
            profilePicPath=`/uploads/${filename}`;
        }

        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            verifyToken:token,
            isVerified:true,
            profilePic:profilePicPath,
        });
        await newUser.save();
        return {success:true,message:'Registration successful'};
    }
    catch(err){
        console.error("Error during registration",err);
        return {success:false,message:err.message};
    }
}