"use client";
import React, { useState, useEffect } from "react";
import { userSession } from "@/app/utils/config/userSession";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent,CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {signOut} from 'next-auth/react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CircleCheck } from "lucide-react";
import { profileAction } from "@/app/serverActions/profileAction";
import Image from "next/image";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [userImage, setUserImage] = useState("https://github.com/shadcn.png");
    const [joinedDate, setJoinedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const session = await userSession();
                const {userDoc} = await profileAction();
                console.log(userDoc);
                if (session?.user) {
                    setUser(session.user);
                    setName(session.user.name || "User");
                    setUserImage(session.user.profilePic||"https://github.com/shadcn.png");
                    setJoinedDate(userDoc?.createdAt||null);
                }

            } catch (error) {
                console.error("Error fetching user session:", error);
                setError("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);
    // const handleSave = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await editProfileAction(name,newPassword);
    //         console.log(name,newPassword);
    //         if (response.success) {
    //             setMessage("Profile updated successfully");
    //             setUser(response.user);
    //             setIsEditing(false);
    //             setError(null);
    //         } else {
    //             setError(response.error || "Failed to update profile");
    //             setMessage(null);
    //         }
    //     } catch (error) {
    //         console.error("Error updating profile:", error);
    //         setError("An unexpected error occurred.");
    //         setMessage(null);
    //     }
    // };
    const formattedDate = new Date(joinedDate).toLocaleDateString('en-GB').replace(/\//g,'-');
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>No user data found.Please log in again</div>;

    return (
        <div className="mt-6">
            {error && (
                <Alert className="w-[350px] bg-transparent text-red-600 border border-red-600 block mx-auto">
                    <AlertCircle className="h-5 w-5 stroke-red-600" />
                    <AlertTitle className="font-semibold">Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {message && (
                <Alert className="w-[350px] text-green-600 bg-transparent border border-green-600 block mx-auto">
                    <CircleCheck className="h-5 w-5 stroke-green-600" />
                    <AlertTitle className="font-semibold">Success</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}

            <Card className="w-[350px] mt-2 block max-w-md mx-auto rounded-md">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Your profile information</CardDescription>
                </CardHeader>
                <CardContent>

                        <div className="flex flex-col space-y-4">
                            <Image src={userImage} alt='Profile' width='100' height='100' className='mx-auto block rounded-full'/>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    value={name}
                                    disabled={true}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="bg-gray-300 dark:bg-slate-800 dark:text-gray-200"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={user.email}
                                    disabled={true}
                                    className="bg-gray-300 dark:bg-slate-800 dark:text-gray-200 cursor-not-allowed"
                                />
                            </div>

                        </div>

                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-4">
                    <Button onClick={()=>signOut()}  className="w-full text-md bg-[#e23636] hover:bg-red-600 dark:text-white">Logout</Button>
                    <p className='block mx-auto text-center text-gray-500'>Account created on {formattedDate}</p>
                </CardFooter>

            </Card>
        </div>
    );
};

export default ProfilePage;
