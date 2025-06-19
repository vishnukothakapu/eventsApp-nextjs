"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CalendarClock, Edit, Users, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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

    const formatDate = (dateString) => format(new Date(dateString), "PPP");
    const formatTime = (timeString) => format(new Date(`2000-01-01T${timeString}`), "h:mm a");

    useEffect(() => {
        if (!user && !loading) {
            router.push("/login");
        }
    }, [user, loading, router]);

    return (
        <div className="container py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Events</h1>
                    <p className="text-muted-foreground">
                        {events.length} {events.length === 1 ? "event" : "events"} created
                    </p>
                </div>
                <Button
                    className="gap-2"
                    onClick={() => router.push(`/add-event`)}
                >
                    <Plus className="h-4 w-4" />
                    Create Event
                </Button>
            </div>

            {loading ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="p-0">
                                <Skeleton className="aspect-video w-full rounded-t-lg" />
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Skeleton className="h-9 w-full" />
                                <Skeleton className="h-9 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : events.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {events.map((event) => (
                        <Card 
                            key={event._id} 
                            className="group overflow-hidden transition-all hover:shadow-lg"
                        >
                            <CardHeader className="p-0 relative">
                                <div className="aspect-video relative">
                                    <Image 
                                        src={event.image || "/default-event.jpg"} 
                                        alt={event.title} 
                                        fill 
                                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                                    />
                                </div>
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <Badge variant="secondary">
                                        {event.category}
                                    </Badge>
                                    <Badge variant={event.isOnline ? "default" : "outline"}>
                                        {event.isOnline ? "Online" : "Offline"}
                                    </Badge>
                                </div>
                                {event.price === 0 ? (
                                    <Badge className="absolute top-3 right-3 bg-green-600 hover:bg-green-700">
                                        Free
                                    </Badge>
                                ) : (
                                    <Badge className="absolute top-3 right-3">
                                        ₹{event.price}
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                <CardTitle className="text-lg font-semibold line-clamp-2">
                                    {event.title}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarClock className="h-4 w-4" />
                                    <span>
                                        {formatDate(event.date)}, {formatTime(event.time)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Host: </span>
                                    <span className="font-medium">
                                        {event.host?.name}
                                        {event.host?._id === user?.id && (
                                            <span className="text-indigo-600 ml-1">(You)</span>
                                        )}
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 gap-2" 
                                    onClick={() => router.push(`/events/my-events/edit/${event._id}`)}
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button 
                                    variant="default" 
                                    className="flex-1 gap-2"
                                    onClick={() => router.push(`/events/my-events/bookings/${event._id}`)}
                                >
                                    <Users className="h-4 w-4" />
                                    Bookings
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <CalendarClock className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold">No events created yet</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                        You haven't created any events. Get started by creating your first event!
                    </p>
                    <Button
                        className="mt-4"
                        onClick={() => router.push(`/add-event`)}
                    >
                        Create Event
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MyEventsPage;