"use client"
import {React, useEffect, useState} from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from 'next/navigation';
import { uploadFile } from "uploadthing/client";
import {userSession} from "@/app/utils/config/userSession";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {AlertCircle,BadgeCheck} from 'lucide-react'
import { registerAction } from '../serverActions/registerAction';
import {signIn} from "next-auth/react";
import {FcGoogle} from "react-icons/fc";
const RegisterForm = () => {
    const router = useRouter();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [profilePic,setProfilePic]=useState(null);
    const [message,setMessage]=useState('');
    const [error,setError]=useState('');
    const [loading,setLoading]=useState(false);
    const [isAuthenticated,setIsAuthenticated]=useState(false);
    useEffect(() => {
        const fetchSession = async()=>{
            const session = await userSession();
            if(session?.user){
                setIsAuthenticated(true);
            }
            else {
                setIsAuthenticated(false);
            }
        };
        fetchSession();
    }, []);
    if(isAuthenticated){
        router.push("/");
    }
    async function handleRegister(e){
        e.preventDefault();
        setLoading(true);
        try {
          const formData = new FormData();
            formData.append("name",name);
            formData.append("email",email);
            formData.append("password",password);
            if(profilePic){
                formData.append("profilePic",profilePic);
            }
          const response = await registerAction(formData);
            if(response.success){
               setMessage('Registration successful. Please login');
              setError('');
                setTimeout(()=>{
                    router.push('/login');
                },2000);
            }
            else {
                // toast({
                // variant:"destructive",
                //   description: "Registration Failed.Please try again.",
                // });
                setError(response.message||"Registation Failed");
                setMessage('');
            }
        }
        catch(err){
            console.log(err);
            // toast({
            //     variant:"destructive",
            //       description: err.message,
            //     });
            setError(err.message);
            setLoading(false);
            setMessage('');
        }
        setLoading(false);
    }
    async function handleGoogleSignIn(){
        try{
            await signIn("google");
        }
        catch(err){
            console.error(err);
            setError(err||"Google SignIn Failed. Please try again later");
        }
    }
  return (
    <div className="mt-4 flex flex-col justify-center items-center ">
      {error && 
       <Alert  className='my-2 w-[350px] bg-transparent text-red-600 border border-red-600 '>
      <AlertCircle className="h-5 w-5 stroke-red-500" />
      <AlertTitle className="font-semibold">Error</AlertTitle>
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
      }
      {message && 
     <Alert  className='my-2 w-[350px] bg-transparent border border-green-600 text-green-600'>
      <BadgeCheck className="h-5 w-5 stroke-green-600" />
      <AlertTitle className="font-semibold text-green-600">Registered Successfully</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
      }
      <Card className="w-[350px] mt-3">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Sign up to create a new account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" onChange={(e)=>setName(e.target.value)} placeholder="John Doe" required/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" onChange={(e)=>setEmail(e.target.value)} placeholder="john@example.com" required/>
               
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" onChange={(e)=>setPassword(e.target.value)} placeholder="1234"  autoComplete="new-password"  required/>
               
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="image">Profile Picture</Label>
                <Input type="file" id="image" onChange={(e)=>setProfilePic(e.target.files[0])}  />
              </div>
            </div>
        <CardFooter className="flex flex-col items-center mt-3">
          <Button className="w-full bg-indigo-700 text-white hover:bg-indigo-800" type="submit"  disabled={loading}>
              {loading?"Registering...":"Register"}
          </Button>
          <p className="text-sm text-gray-500 mt-3">Already have an account?{" "}
            <a href="/login" className="text-indigo-700">Login</a>
          </p>
            <div className='flex items-center my-2 w-full gap-1'>
                <hr className='border border-t w-full'/>
                <span className="text-gray-400">or</span>
                <hr className='border border-t w-full '/>
            </div>
            <Button className='flex items-center w-full px-2 py-4  bg-white rounded-md text-black border border-gray-200 shadow-md hover:text-white' onClick={handleGoogleSignIn}>
                <FcGoogle/>
                Sign in with Google
            </Button>

        </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterForm