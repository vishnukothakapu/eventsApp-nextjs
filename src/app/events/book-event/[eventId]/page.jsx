"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarClock, MapPin, UserRound, ArrowLeft, Ticket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const PaymentPage = ({ params }) => {
    const { eventId } = params;
    const router = useRouter();

    const [event, setEvent] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const sessionRes = await fetch("/api/auth/session");
                const session = await sessionRes.json();
                
                if (session?.user) {
                    setName(session.user.name);
                    setEmail(session.user.email);
                }

                const response = await fetch(`/api/events/book-event/${eventId}`);
                const data = await response.json();
                
                if (data.success) {
                    setEvent(data.event);
                } else {
                    setError(data.error || "Failed to fetch event details.");
                }
            } catch (error) {
                console.error("Error fetching event:", error);
                setError("Failed to load event details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handlePayment = async () => {
        if (!event) return;

        // Validation
        if (!name.trim()) return alert("Please enter your name");
        if (!email.trim()) return alert("Please enter your email");
        if (!mobileNumber.trim()) return alert("Please enter your mobile number");
        if (!/^\d{10}$/.test(mobileNumber)) return alert("Please enter a valid 10-digit mobile number");

        setIsProcessing(true);

        try {
            const response = await fetch(`/api/events/book-event/${event._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: event.price * 100 }),
            });

            if (!response.ok) throw new Error("Failed to create order");

            const data = await response.json();
            if (!data.order_id) throw new Error("Order ID not found");

            const loadRazorpay = () => {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.async = true;
                script.onload = () => {
                    const options = {
                        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                        amount: event.price * 100,
                        currency: "INR",
                        name: "Eventify",
                        description: `Booking for ${event.title}`,
                        order_id: data.order_id,
                        handler: async (response) => {
                            if (response.razorpay_payment_id) {
                                const confirmPayment = await fetch(`/api/events/book-event/${event._id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        orderId: response.razorpay_order_id,
                                        paymentId: response.razorpay_payment_id,
                                        signature: response.razorpay_signature,
                                    }),
                                });
                                const confirmData = await confirmPayment.json();
                                if (confirmData.success) {
                                    router.push(`/my-bookings/${data.eventId}`);
                                }
                            }
                        },
                        prefill: { 
                            name, 
                            email, 
                            contact: mobileNumber 
                        },
                        theme: { 
                            color: "#6366f1" // Indigo color matching your theme
                        },
                    };

                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                    rzp1.on("payment.failed", () => {
                        alert("Payment failed. Please try again.");
                        setIsProcessing(false);
                    });
                };
                document.body.appendChild(script);
            };

            loadRazorpay();
        } catch (err) {
            console.error("Payment error:", err);
            alert("An error occurred. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0c111d] flex items-center justify-center">
                <div className="max-w-4xl w-full space-y-8 p-6">
                    <Button 
                        variant="ghost" 
                        className="gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to event
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Event Details Skeleton */}
                        <Card className="animate-pulse">
                            <CardHeader>
                                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                                <div className="flex gap-3">
                                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                                </div>
                                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Form Skeleton */}
                        <Card className="animate-pulse">
                            <CardHeader>
                                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between">
                                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                                </div>
                                <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0c111d] flex items-center justify-center">
                <div className="max-w-md w-full p-6 text-center">
                    <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
                        <div className="flex gap-4 justify-center">
                            <Button 
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Go Back
                            </Button>
                            <Button 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0c111d] flex items-center justify-center">
                <div className="max-w-md w-full p-6 text-center">
                    <div className="p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">Event not found</p>
                        <Button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={() => router.push('/events')}
                        >
                            Browse Events
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0c111d] py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <Button 
                    variant="ghost" 
                    className="mb-6 gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to event
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Event Details Card */}
                    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                Event Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative aspect-video rounded-lg overflow-hidden">
                                <Image
                                    src={event.image || "/default-event.jpg"}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                    {event.category}
                                </span>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                    {event.isOnline ? "Online" : "Offline"}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h2>
                            <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <CalendarClock className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {new Date(event.date).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {formatTime(event.time)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {event.location || "Online Event"}
                                    </p>
                                </div>

                                <div className="flex items-start gap-4">
                                    <UserRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Host: <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {event.host?.name || "Unknown"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Card */}
                    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                Payment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-600 dark:text-gray-400">Ticket Price</p>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">₹{event.price}</p>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex justify-between items-center">
                                    <p className="text-gray-900 dark:text-gray-100 font-semibold">Total Amount</p>
                                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">₹{event.price}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="dark:bg-gray-800 dark:border-gray-700"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        disabled
                                        className="dark:bg-gray-800 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mobile" className="text-gray-700 dark:text-gray-300">Mobile Number</Label>
                                    <Input
                                        id="mobile"
                                        type="tel"
                                        placeholder="Enter 10-digit mobile number"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        className="dark:bg-gray-800 dark:border-gray-700"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                onClick={handlePayment} 
                                disabled={isProcessing}
                                className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 dark:shadow-indigo-900/30 gap-2 py-6"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <Ticket className="h-5 w-5" />
                                        Pay Now
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;