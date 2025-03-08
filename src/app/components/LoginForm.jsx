"use client";
import React, {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import {signIn} from 'next-auth/react';
import { FcGoogle } from "react-icons/fc";
import {userSession} from "@/app/utils/config/userSession";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {AlertCircle,CircleCheck} from 'lucide-react'
import {useRouter} from 'next/navigation';
import { loginAction } from '../serverActions/loginAction';
import Link from 'next/link';
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState(false)
  const [message, setMessage] = useState("");
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchSession = async()=>{
      const session = await userSession();
      if(session?.user){
        setIsAuthenticated(true);
      }
    };
    fetchSession();
  }, []);
  async function handleLogin(e) {
    e.preventDefault();      
    const userDetails = { email, password };
    try {
      const response = await loginAction(userDetails);
      if(response.success){
        setMessage("Logged in successfully!"); 
        setError("");
        router.push("/");
      }
      else {
        setError(response.message||'Login failed. Please try again');
        setMessage('');
      }
    } catch (err) {
      console.log(err);
      setError(err.message||"An unexpected error occurred. Please try again");
      setMessage("");
    }
  }
async function handleGoogleSignIn(){
  try {
    await signIn("google",{
      callbackUrl:"/",
    });
  }
  catch(err){
    console.error(err);
    setError(err||"Google SignIn Failed. Please try again later");
  }
}

  return (
    <div className="mt-4 flex flex-col justify-center items-center">
      {error && 
     <Alert  className='w-[350px] bg-transparent text-red-600 border border-red-600 '>
      <AlertCircle className="h-5 w-5 stroke-red-600" />
      <AlertTitle className="font-semibold">Error</AlertTitle>
      <AlertDescription className="">
        {error}
      </AlertDescription>
    </Alert>

      }
      {message && 
          <Alert className="w-[350px] text-green-600 bg-transparent border border-green-600 mt-2">
            <CircleCheck className="h-5 w-5 stroke-green-600" />
            <AlertTitle className="font-semibold ">Success</AlertTitle>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
}

      <Card className="w-[350px] mt-3">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                   autoComplete="current-password" 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <CardFooter className="flex flex-col items-center mt-4 space-y-3">
              <Button type="submit" className="w-full text-md bg-indigo-700 text-white hover:bg-indigo-800">
                Login
              </Button>
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <a href="/register" className="text-indigo-700 hover:underline">
                  Register
                </a>
              </p>
              <div className='flex items-center my-2 w-full gap-1'>
                <hr className='border border-t w-full'/>
                <span className="text-gray-400">or</span>
                <hr className='border border-t w-full '/>
              </div>
              <Button
                  className='flex items-center w-full px-2 py-4  bg-white rounded-md text-black border hover:text-black border-gray-200 shadow-md hover:text-white '
                  onClick={handleGoogleSignIn}>
                <FcGoogle/>
                Login with Google
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
