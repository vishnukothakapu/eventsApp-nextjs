import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { CalendarClock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const EventCard = ({ filteredEvents, user }) => {
    const router = useRouter();

    const formatDate = (dateString) => {
        const options = { weekday: "long", day: "2-digit", month: "short" };
        const date = new Date(dateString);
        return `${date.toLocaleDateString("en-US", options)}`;
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    return (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {filteredEvents.map((event) => (
                <Card
                    key={event._id}
                    className="flex flex-col hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-[#0c111d] dark:border h-full"
                >
                    <CardHeader className="p-0">
                        {event.image && (
                            <div className="relative w-full h-48">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="rounded-t-md object-cover cursor-pointer"
                                    onClick={()=>router.push(`/events/${event._id}`)}
                                />
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
                            <CardTitle className="text-xl font-semibold cursor-pointer" onClick={()=>router.push(`/events/${event._id}`)}>{event.title}</CardTitle>
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
                                {event.host.name}
                                {user && event.host._id === user.id && (
                                    <span className="text-indigo-700"> (You)</span>
                                )}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t p-4">
                        {event.price === 0 ? (
                            <p className="text-md text-white dark:text-[#75e0a7] bg-green-600 border dark:border-[#75e0a7] dark:bg-[#053321] px-4 py-2 rounded-md cursor-not-allowed">
                                Free
                            </p>
                        ) : (
                            <p className="text-md rounded-md cursor-not-allowed dark:bg-[#161b26] dark:text-white bg-gray-200 dark:border px-4 py-2">
                                ₹ {event.price}
                            </p>
                        )}
                        <Button
                            className="px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-all"
                            onClick={() => router.push(`/events/${event._id}`)}
                        >
                            View Details
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default EventCard;