"use client";
import React, {useCallback, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import {CalendarClock,Ticket,Pencil,MapPin,ContactRound,UserRound} from "lucide-react";
import { Button } from "@/components/ui/button";
import EventSkeleton from "@/app/components/EventSkeleton";

const Page = ({ params }) => {
    const { eventId } = params;
    const [user, setUser] = useState(null);
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [event, setEvent] = useState(null);
    const [eventLoading, setEventLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();


        const fetchEventDetails = useCallback(async () => {
            try {
                setEventLoading(true);
                setError(null);
                // Fetch Event Details
                const res = await fetch(`/api/events/${eventId}`);
                const data = await res.json();
                console.log("Event Details:", data);
                if (data.success) {
                    setEvent(data.event);
                } else {
                    setError(data.error || "Failed to fetch event details.");
                }
                // Fetch Related Events
                const result = await fetch("/api/events");
                const resultData = await result.json();
                console.log("All Events Data:", resultData);
                if (resultData.success) {
                    setRelatedEvents(resultData.events);
                } else {
                    setError(resultData.error || "Failed to fetch related events.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Something went wrong.");
            } finally {
                setEventLoading(false);
            }
        },[eventId]);
    const fetchUserSession = useCallback(async () => {
        try {
            setUserLoading(true);
            const res = await fetch("/api/auth/session");
            const data = await res.json();
            setUser(data.user || null);
        } catch (error) {
            console.error("Error fetching user session:", error);
        } finally {
            setUserLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchEventDetails();
    },[fetchEventDetails]);
    useEffect(() => {
        fetchUserSession();
    },[]);
    const handleGetTicketButton = ()=>{
        if(!user){
            return router.push("/login");
        }
        router.push(`/events/book-event/${event._id}`);
    }
    if (eventLoading) return <EventSkeleton/>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!event) return <p>Event not found.</p>;

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

    const filteredRelatedEvents = relatedEvents.filter((relatedEvent) => relatedEvent.category === event.category && relatedEvent._id !== event._id);
    console.log("Filtered Related Events:", filteredRelatedEvents);

    return (
        <div className="max-w-4xl mx-auto p-4 font-poppins">
            <Card className="shadow-lg rounded-lg bg-white dark:bg-[#0c111d] dark:border">
                <CardHeader className="flex flex-col p-4 rounded-t-lg items-center">
                    <Image
                        src={event.image}
                        alt={event.title}
                        width={400}
                        height={400}
                        className="w-full h-100 object-cover rounded-md mb-4"
                    />
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{event.title}</h1>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex gap-3 items-center">
                        <p className="text-gray-600 font-medium bg-gray-200 dark:bg-[#161b26] dark:border dark:text-gray-300 mb-2 px-2 py-1 rounded-md text-center">{event.category}</p>
                        <p className=" text-gray-600 font-medium bg-gray-200 dark:bg-[#161b26] dark:border dark:text-gray-300 mb-2 px-2 py-1 rounded-md text-center">{event.isOnline ? "Online" : "Offline"}</p>
                    </div>
                    <p className="mb-2 mt-6 text-md text-gray-500 dark:text-gray-400">{event.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                        <CalendarClock className="w-5 h-5"/>
                        <p className=" text-gray-600 dark:text-gray-300">
                            {formatDate(event.date)}, {formatTime(event.time)}
                        </p>
                    </div>

                    {!event.isOnline && (
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-5 h-5"/>
                            <p className=" text-gray-600 dark:text-gray-300">
                                {event.location}
                            </p>
                        </div>

                    )}

                    <div className="flex items-center gap-2">
                        <UserRound className="w-5 h-5"/>
                        <p className="text-gray-600 dark:text-gray-300">
                            <strong>Host: </strong>
                            {event.host?.name || "Unknown"}
                            {event.host?._id === user?.id && <span className="text-indigo-700"> (You)</span>}
                        </p>

                    </div>


                </CardContent>
                <CardFooter className="flex justify-between items-center p-4 border-t rounded-b-lg">
                    {event.price === 0 ? (
                        <p className="text-md bg-green-600 text-white dark:text-[#75e0a7] border dark:border-[#75e0a7] dark:bg-[#053321] px-4 py-2 rounded-md">
                            Free
                        </p>
                    ) : (
                        <p className=" text-md bg-gray-200 dark:bg-[#161b26] dark:text-white dark:border px-4 py-2 rounded-md">
                        ₹ {event.price}
                        </p>
                    )}
                    {event.host?._id === user?.id ? (
                        <Button
                            className=" bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-2 rounded-md transition-all"
                            onClick={() => router.push(`/events/my-events/edit/${event._id}`)}
                        >
                            Edit Event
                        </Button>
                    ) : (
                        <Button
                            onClick={handleGetTicketButton}
                            className="flex items-center bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-2 rounded-md transition-all gap-2"
                        >
                            <Ticket className="w-5 h-5"/>
                            Get Ticket
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <div className="border-b mt-8 py-2 text-xl font-bold">Related Events</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4 ">
                {filteredRelatedEvents.length > 0 ? (
                    filteredRelatedEvents.map((relatedEvent) => (
                        <Card key={relatedEvent._id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-[#0c111d] dark:border">
                            <CardHeader>
                                {relatedEvent.image && (
                                    <Image src={relatedEvent.image} alt={relatedEvent.title} width={200} height={200}
                                           className="w-full rounded-t-md object-cover mb-2"/>
                                )}
                                <div className="flex gap-3 items-center">
                                    <p className="text-gray-600 font-medium bg-gray-200 dark:bg-[#161b26] dark:border dark:text-gray-300 mb-2 px-2 py-1 rounded-md text-center">{relatedEvent.category}</p>
                                    <p className=" text-gray-600 font-medium bg-gray-200 dark:bg-[#161b26] dark:border dark:text-gray-300 mb-2 px-2 py-1 rounded-md text-center">{relatedEvent.isOnline ? "Online" : "Offline"}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-xl font-semibold mb-2">{relatedEvent.title}</CardTitle>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                    <strong>Date &
                                        Time:</strong> {formatDate(relatedEvent.date)}, {formatTime(relatedEvent.time)}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                <strong>Host:</strong> {relatedEvent.host?.name || "Unknown"}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between font-medium items-center mt-4 border-t">
                                {relatedEvent.price === 0 ?
                                    <p className="mt-4 text-md  text-white dark:text-[#75e0a7] bg-green-600 border dark:border-[#75e0a7] dark:bg-[#053321] px-4 py-2 rounded-md cursor-not-allowed">Free</p> :
                                    <p className="mt-4 text-md rounded-md cursor-not-allowed dark:bg-[#161b26] dark:text-white dark:border px-4 py-2 ">₹ {relatedEvent.price}</p>
                                }
                                <Button className="mt-4 px-4 py-1 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-all"
                                        onClick={() => router.push(`/events/${relatedEvent._id}`)}
                                >
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500 mt-4">No related events found.</p>
                )}
            </div>
        </div>
    );
};

export default Page;
