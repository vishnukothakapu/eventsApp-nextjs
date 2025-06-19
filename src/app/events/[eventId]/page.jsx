"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { CalendarClock, Ticket, Pencil, MapPin, UserRound, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Page = ({ params }) => {
    const { eventId } = params;
    const [user, setUser] = useState(null);
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchEventDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/events/${eventId}`);
            const data = await res.json();
            if (data.success) {
                setEvent(data.event);
            } else {
                setError(data.error || "Failed to fetch event details.");
            }
            const result = await fetch("/api/events");
            const resultData = await result.json();
            if (resultData.success) {
                setRelatedEvents(resultData.events);
            } else {
                setError(resultData.error || "Failed to fetch related events.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    const fetchUserSession = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/session");
            const data = await res.json();
            setUser(data.user || null);
        } catch (error) {
            console.error("Error fetching user session:", error);
        }
    }, []);

    useEffect(() => {
        fetchEventDetails();
        fetchUserSession();
    }, [fetchEventDetails]);

    const handleGetTicketButton = () => {
        if (!user) return router.push("/login");
        router.push(`/events/book-event/${event._id}`);
    };

    const formatDate = (dateString) => {
        const options = { weekday: "short", day: "numeric", month: "short" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    const filteredRelatedEvents = relatedEvents.filter(
        (relatedEvent) => relatedEvent.category === event?.category && relatedEvent._id !== event?._id
    );

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse mb-6 h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                    <div className="space-y-6">
                        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
                        <div className="space-y-4 pt-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
                    <Button 
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={fetchEventDetails}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Event not found</p>
                    <Button 
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => router.push('/events')}
                    >
                        Browse Events
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button 
                variant="ghost" 
                className="mb-6 gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to events
            </Button>

            {/* Main Event Card */}
            <Card className="overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Event Image */}
                    <div className="relative aspect-square">
                        <Image
                            src={event.image || "/default-event.jpg"}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute bottom-4 left-4 flex gap-2">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-600 text-white backdrop-blur-sm">
                                {event.category}
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-900 dark:bg-gray-800 dark:text-white backdrop-blur-sm">
                                {event.isOnline ? "Online" : "Offline"}
                            </span>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6 flex flex-col">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                                {event.title}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0 flex-1 space-y-6">
                            <p className="text-gray-600 dark:text-gray-300 text-lg">
                                {event.description}
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <CalendarClock className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {formatDate(event.date)}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {formatTime(event.time)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {event.location || event.location==null?"Online Event":""}
                                    </p>
                                </div>

                                <div className="flex items-start gap-4">
                                    <UserRound className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Hosted by <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {event.host?.name || "Unknown"}
                                            {event.host?._id === user?.id && (
                                                <span className="text-indigo-600 dark:text-indigo-400"> (You)</span>
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="p-0 mt-8">
                            <div className="w-full flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Ticket className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    {event.price === 0 ? (
                                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                            Free
                                        </span>
                                    ) : (
                                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            ₹{event.price}
                                        </span>
                                    )}
                                </div>
                                {event.host?._id === user?.id ? (
                                    <Button
                                        size="lg"
                                        className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 dark:shadow-indigo-900/30 gap-2"
                                        onClick={() => router.push(`/events/my-events/edit/${event._id}`)}
                                    >
                                        <Pencil className="h-5 w-5" />
                                        Edit Event
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 dark:shadow-indigo-900/30 gap-2"
                                        onClick={handleGetTicketButton}
                                    >
                                        <Ticket className="h-5 w-5" />
                                        Get Ticket
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </div>
                </div>
            </Card>

            {/* Related Events */}
            {filteredRelatedEvents.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 pb-2 border-b border-gray-200 dark:border-gray-800">
                        Related Events
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRelatedEvents.map((relatedEvent) => (
                            <Card 
                                key={relatedEvent._id}
                                className="group overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-900/50 backdrop-blur-sm"
                            >
                                <div className="relative aspect-video">
                                    <Image
                                        src={relatedEvent.image || "/default-event.jpg"}
                                        alt={relatedEvent.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                            {relatedEvent.category}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                            {relatedEvent.isOnline ? "Online" : "Offline"}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl font-bold line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/events/${relatedEvent._id}`)}
                                    >
                                        {relatedEvent.title}
                                    </CardTitle>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-gray-600 dark:text-gray-400">
                                            <CalendarClock className="inline h-4 w-4 mr-1" />
                                            {formatDate(relatedEvent.date)}, {formatTime(relatedEvent.time)}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            <MapPin className="inline h-4 w-4 mr-1" />
                                            {relatedEvent.location || "Online Event"}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            <UserRound className="inline h-4 w-4 mr-1" />
                                            Host: {relatedEvent.host?.name || "Unknown"}
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 pt-0">
                                    <Button
                                        size="sm"
                                        className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 dark:shadow-indigo-900/30"
                                        onClick={() => router.push(`/events/${relatedEvent._id}`)}
                                    >
                                        View Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;