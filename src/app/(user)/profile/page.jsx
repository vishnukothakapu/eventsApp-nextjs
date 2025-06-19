"use client";
import React, { useState, useEffect } from "react";
import { userSession } from "@/app/utils/config/userSession";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signOut } from 'next-auth/react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CircleCheck, Edit, LogOut, Calendar } from "lucide-react";
import { profileAction } from "@/app/serverActions/profileAction";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [userImage, setUserImage] = useState("https://github.com/shadcn.png");
    const [joinedDate, setJoinedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const session = await userSession();
                const { userDoc } = await profileAction();
                
                if (session?.user) {
                    setUser(session.user);
                    setName(session.user.name || "User");
                    setUserImage(session.user.profilePic || "https://github.com/shadcn.png");
                    setJoinedDate(userDoc?.createdAt || null);
                }
            } catch (error) {
                console.error("Error fetching user session:", error);
                setError("Failed to fetch user data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Add your profile update logic here
            setMessage("Profile updated successfully");
            setIsEditing(false);
            setError(null);
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("An error occurred while updating your profile.");
            setMessage(null);
        }
    };

    const formattedDate = joinedDate ? new Date(joinedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : "Unknown";

    if (loading) {
        return (
            <div className="max-w-md mx-auto py-8 px-4">
                <div className="space-y-8">
                    <div className="flex flex-col items-center space-y-4">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <Skeleton className="h-8 w-48" />
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-5 w-48 mx-auto" />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-md mx-auto py-8 px-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>No user data found</AlertTitle>
                    <AlertDescription>
                        Please log in again to view your profile.
                    </AlertDescription>
                </Alert>
                <Button 
                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => signOut()}
                >
                    Go to Login
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto py-8 px-4">
            {/* Success/Error Messages */}
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {message && (
                <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-600 dark:border-green-400">
                    <CircleCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-600 dark:text-green-400">Success</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-400">
                        {message}
                    </AlertDescription>
                </Alert>
            )}

            {/* Profile Card */}
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="items-center text-center">
                    <div className="relative">
                        <Image 
                            src={userImage}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="rounded-full border-4 border-indigo-100 dark:border-indigo-900/30"
                        />
                        {isEditing && (
                            <Button 
                                size="icon"
                                variant="ghost"
                                className="absolute bottom-0 right-0 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                        {name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        Joined {formattedDate}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                            Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            disabled={!isEditing}
                            onChange={(e) => setName(e.target.value)}
                            className={`${!isEditing ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={user.email}
                            disabled
                            className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                        />
                    </div>

                    {isEditing && (
                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                onClick={handleSave}
                            >
                                Save Changes
                            </Button>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-3">
                    {!isEditing && (
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    )}
                    <Button
                        variant="destructive"
                        className="w-full gap-2"
                        onClick={() => signOut()}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ProfilePage;