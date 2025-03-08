"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CalendarClock } from "lucide-react";
import EventsSkeleton from "@/app/components/EventsSkeleton";

const MyEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [eventRes, userRes] = await Promise.all([
                    fetch(`/api/events/my-events`),
                    fetch("/api/auth/session")
                ]);

                const eventData = await eventRes.json();
                const userData = await userRes.json();

                if (userData?.user) {
                    setUser(userData.user);
                    setEvents(eventData.success ? eventData.events : []);
                } else {
                    router.push("/login");
                }
            } catch (err) {
                console.error("Error fetching data:", err.message);
            }
            setLoading(false);
        };

        fetchData();
    }, [router]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "short",
    });

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };
    useEffect(() => {
        if (!user && !loading) {
            router.push("/login");
        }
    }, [user, loading, router]);

    return (
        <div className="p-6 md:p-12 max-w-screen-xl mx-auto">
            <div className="flex items-center justify-between border-b p-2">
                <h2 className="font-bold text-xl">My Events</h2>
                <Button
                    className="bg-indigo-600 text-white hover:bg-indigo-800"
                    onClick={() => router.push(`/add-event`)}
                >
                    Add Event
                </Button>
            </div>

            {loading ? <EventsSkeleton /> : null}

            {events.length > 0 ? (
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                    {events.map((event) => (
                        <Card key={event._id} className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-[#0c111d] dark:border">
                            <CardHeader className="p-0">
                                {event.image && (
                                    <div className="relative w-full h-48">
                                        <Image src={event.image} alt={event.title} fill className="rounded-t-md object-cover mb-2" />
                                    </div>
                                )}
                                <div className="flex gap-3 items-center p-4">
                                    <p className="text-gray-600 font-medium bg-gray-200 dark:bg-[#161b26] dark:border dark:text-gray-300 px-2 py-1 rounded-md text-center">
                                        {event.category}
                                    </p>
                                    <p className="text-gray-600 font-medium bg-gray-200 dark:bg-[#161b26] dark:border dark:text-gray-300 px-2 py-1 rounded-md text-center">
                                        {event.isOnline ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-4">
                                <div className="mb-2">
                                    <CardTitle className="text-xl font-semibold">{event.title}</CardTitle>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CalendarClock className="w-5 h-5" />
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {formatDate(event.date)}, {formatTime(event.time)}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <strong>Host: </strong>
                                        {event.host?.name}{" "}
                                        {event.host?._id === user?.id && (
                                            <span className="text-indigo-700"> (You)</span>
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between font-medium items-center border-t p-4">
                                {event.price === 0 ? (
                                    <p className="text-md bg-green-600 text-white dark:text-[#75e0a7] border dark:border-[#75e0a7] dark:bg-[#053321] px-4 py-2 rounded-md cursor-not-allowed">
                                        Free
                                    </p>
                                ) : (
                                    <p className="text-md rounded-md cursor-not-allowed dark:bg-[#161b26] dark:text-white dark:border px-4 py-2">
                                        ₹ {event.price}
                                    </p>
                                )}
                                <Button
                                    className="px-4 py-1 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-all"
                                    onClick={() => router.push(`/events/my-events/edit/${event._id}`)}
                                >
                                    Edit Event
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-lg text-gray-700">No events found.</p>
            )}
        </div>
    );
};

export default MyEventsPage;
