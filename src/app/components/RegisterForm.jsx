"use client"
import { React, useEffect, useState } from 'react';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BadgeCheck, Loader2 } from 'lucide-react'
import { registerAction } from '../serverActions/registerAction';
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { userSession } from "@/app/utils/config/userSession";
import { Separator } from "@/components/ui/separator";

const RegisterForm = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await userSession();
            setIsAuthenticated(!!session?.user);
        };
        fetchSession();
    }, []);

    if (isAuthenticated) {
        router.push("/");
        return null;
    }

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            if (profilePic) {
                formData.append("profilePic", profilePic);
            }

            const response = await registerAction(formData);
            
            if (response.success) {
                setMessage('Registration successful. Redirecting to login...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(response.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignIn() {
        try {
            await signIn("google");
        } catch (err) {
            console.error(err);
            setError("Google Sign-In failed. Please try again later.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0c111d] p-4">
            <div className="w-full max-w-md">
                {/* Success/Error Messages */}
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {message && (
                    <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-600 dark:border-green-400">
                        <BadgeCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <AlertTitle className="text-green-600 dark:text-green-400">Success</AlertTitle>
                        <AlertDescription className="text-green-600 dark:text-green-400">
                            {message}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Registration Card */}
                <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            Create an account
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Join us to get started
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                                    Full Name
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    required
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                                    Password
                                </Label>
                                <Input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    required
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-gray-700 dark:text-gray-300">
                                    Profile Picture (Optional)
                                </Label>
                                <Input
                                    type="file"
                                    id="image"
                                    onChange={(e) => setProfilePic(e.target.files[0])}
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 dark:shadow-indigo-900/30"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Register"
                                )}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <FcGoogle className="h-5 w-5" />
                            Google
                        </Button>
                    </CardContent>

                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{" "}
                            <Button
                                variant="link"
                                className="text-indigo-600 dark:text-indigo-400 p-0 h-auto"
                                onClick={() => router.push('/login')}
                            >
                                Sign in
                            </Button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default RegisterForm;