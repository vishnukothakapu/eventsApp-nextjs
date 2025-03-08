"use client";
import React, { useState, useEffect } from "react";
import { userSession } from "@/app/utils/config/userSession";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {generatePDF} from '@/app/utils/config/generatePDF';
import { Button } from "@/components/ui/button";

const Page = () => {
    const router = useRouter();
    const [session, setSession] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString) => {
        const options = { weekday: "long", day: "2-digit", month: "short" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    useEffect(() => {
        const fetchSession = async () => {
            const sessionData = await userSession();
            if (!sessionData?.user?.id) {
                router.push("/login");
                return;
            }
            setSession(sessionData);
            fetchBookings(sessionData.user.id);
        };

        const fetchBookings = async (userId) => {
            try {
                const res = await fetch(`/api/bookings?userId=${userId}`);
                if (!res.ok) throw new Error("Failed to fetch bookings");
                const data = await res.json();
                setBookings(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [router]);
    if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
    if (bookings.length === 0) return <p className="text-center text-lg font-semibold">No bookings found.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">My Bookings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                    <Card
                        key={booking._id}
                        className="flex flex-col hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-[#0c111d] dark:border h-full"
                    >
                        <CardHeader className="p-0">
                            <div className="relative w-full h-48">
                                <Image
                                    src={booking.event?.image}
                                    alt={booking.event?.title}
                                    fill
                                    loading="lazy"
                                    className="rounded-t-md object-cover cursor-pointer"
                                    onClick={()=>router.push(`events/${booking.event._id}`)}
                                />
                            </div>
                            <div className="flex gap-3 items-center p-4">
                                <p className="font-medium text-white dark:text-[#75e0a7] bg-green-600 border dark:border-[#75e0a7] dark:bg-[#053321] px-2 py-1 rounded-md text-center">
                                    {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                                </p>

                                <p className="text-gray-600 font-medium bg-gray-200 dark:bg-[#161b26] dark:border dark:text-gray-300 px-2 py-1 rounded-md text-center">
                                    {booking.event?.isOnline ? "Online" : "Offline"}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-4">
                            <div className="mb-2">
                                <CardTitle className="text-xl font-semibold cursor-pointer" onClick={()=>router.push(`events/${booking.event._id}`)}>{booking.event?.title || "Event"}</CardTitle>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <strong>Event Date: </strong>
                                    <p className="text-gray-600 dark:text-gray-300">{formatDate(booking.event?.date)}</p>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300">
                                    <strong>Booked on: </strong>
                                    {formatDate(booking.bookedAt)}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    <strong>Booking Code: </strong>
                                    {"EVT" + booking._id}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center border-t p-4">
                            <Button
                                className="px-4 py-2 border border-indigo-700 text-indigo-700 bg-transparent rounded-md hover:bg-indigo-800 hover:text-white transition-all"
                                onClick={() => router.push(`/my-bookings/${booking._id}`)}
                            >
                                View Booking Details
                            </Button>
                            <Button
                                className="px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-900 transition-all"
                                onClick={() => generatePDF(booking)}
                            >
                                Download Ticket
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Page;
