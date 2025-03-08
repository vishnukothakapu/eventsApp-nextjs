"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarClock, MapPin, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Razorpay from "razorpay";

const PaymentPage = ({ params }) => {
    const { eventId } = params;
    const router = useRouter();

    const [event, setEvent] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [paymentResponse,setPaymentResponse] = useState(null);

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
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
                    alert("Failed to fetch event details.");
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        fetchEvent();
    }, [eventId, router]);

    const handlePayment = async () => {
        if (!event) return alert("Event details not available.");

        if (!name.trim()) return alert("Enter your name");
        if (!email.trim()) return alert("Enter your email");
        if (!mobileNumber.trim()) return alert("Enter your mobile number");

        setIsProcessing(true);

        try {
            const response = await fetch(`/api/events/book-event/${event._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: event.price*100 }),
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
                        amount: event.price*100,
                        currency: "INR",
                        name: "EventsApp",
                        description: "Events App Organization",
                        order_id: data.order_id,
                        handler: async (response) => {
                            if (response.razorpay_payment_id) {
                                console.log("Payment successful", response);
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
                                    alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
                                    router.push("/my-bookings");
                                }
                            } else {
                                alert("Payment failed. Please try again.");
                                router.push(`/events/${eventId}`);

                            }
                        },
                        prefill: { name, email, contact: mobileNumber },
                        theme: { color: "#3399cc" },
                    };

                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                    rzp1.on("payment.failed", () => {
                        alert("Payment failed. Please try again.");
                        router.push(`/events/${eventId}`);
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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#0c111d] p-6">
            <div className="max-w-6xl mx-auto bg-white dark:bg-[#161c27] rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    {event ? (
                        <>
                            {/* Event Details */}
                            <div className="space-y-6">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Event Details</h1>
                                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                                    <Image src={event.image} alt={event.title} layout="fill" objectFit="cover" className="rounded-lg" />
                                </div>
                                <div className="flex gap-3 items-center">
                                    <p className="text-gray-600 font-medium bg-gray-200 dark:bg-[#161b26] dark:border dark:text-gray-300 px-2 py-1 rounded-md text-center">{event.category}</p>
                                    <p className="text-gray-600 font-medium bg-gray-200 dark:bg-[#161b26] dark:border dark:text-gray-300 px-2 py-1 rounded-md text-center">{event.isOnline ? "Online" : "Offline"}</p>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{event.title}</h2>
                                <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CalendarClock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {new Date(event.date).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                day: "2-digit",
                                                month: "short",
                                            })}
                                            , {formatTime(event.time)}
                                        </p>
                                    </div>
                                    {!event.isOnline && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                            <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <UserRound className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                        <p className="text-gray-600 dark:text-gray-300">Host: {event.host?.name || "Unknown"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="space-y-6">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Payment Information</h1>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <p className="text-gray-600 dark:text-gray-300">Ticket Price</p>
                                        <p className="text-gray-800 dark:text-gray-100 font-semibold">₹{event.price}</p>
                                    </div>
                                    <div className="flex justify-between border-t pt-4">
                                        <p className="text-gray-600 dark:text-gray-300 font-semibold">Total</p>
                                        <p className="text-gray-800 dark:text-gray-100 font-bold">₹{event.price}</p>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-[#1f2937] dark:text-gray-100"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 text-gray-400"
                                />
                                <input
                                    type="tel"
                                    placeholder="Enter your mobile number"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-[#1f2937] dark:text-gray-100"
                                />
                                <Button onClick={handlePayment} disabled={isProcessing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg">
                                    {isProcessing ? "Processing..." : "Pay Now"}
                                </Button>
                            </div>
                        </>
                    ) : (
                        // Skeleton Loader
                        <>
                            <div className="space-y-6">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-64 w-full rounded-lg" />
                                <div className="flex gap-3">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                                <Skeleton className="h-6 w-64" />
                                <Skeleton className="h-4 w-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <Skeleton className="h-8 w-48" />
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;