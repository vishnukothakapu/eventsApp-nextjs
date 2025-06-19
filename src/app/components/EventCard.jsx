import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { CalendarClock, MapPin, User, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const EventCard = ({ filteredEvents, user }) => {
    const router = useRouter();

    const formatDate = (dateString) => {
        const options = { weekday: "short", day: "numeric", month: "short" };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", options);
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
                <Card 
                    key={event._id}
                    className="group flex flex-col h-full overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-900/50 backdrop-blur-sm"
                >
                    {/* Event Image */}
                    <div className="relative aspect-video overflow-hidden">
                        <Image
                            src={event.image || "/default-event.jpg"}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            onClick={() => router.push(`/events/${event._id}`)}
                        />
                        <div className="absolute bottom-3 left-3 flex gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-600 text-white backdrop-blur-sm">
                                {event.category}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-900 dark:bg-gray-800 dark:text-white backdrop-blur-sm">
                                {event.isOnline ? "Online" : "Offline"}
                            </span>
                        </div>
                    </div>

                    {/* Event Content */}
                    <CardContent className="flex-1 p-5 space-y-4">
                        <CardTitle 
                            className="text-xl font-bold line-clamp-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            onClick={() => router.push(`/events/${event._id}`)}
                        >
                            {event.title}
                        </CardTitle>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <CalendarClock className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatDate(event.date)}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {formatTime(event.time)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                <p className="text-gray-600 dark:text-gray-400 line-clamp-1">
                                    {event.location || event.location==null?"Online Event":""}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    Hosted by <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {event.host.name}
                                        {user && event.host._id === user.id && (
                                            <span className="text-indigo-600 dark:text-indigo-400"> (You)</span>
                                        )}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </CardContent>

                    {/* Event Footer */}
                    <CardFooter className="p-5 pt-0 border-t border-gray-200 dark:border-gray-800">
                        <div className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Ticket className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                {event.price === 0 ? (
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                        Free
                                    </span>
                                ) : (
                                    <span className="font-bold text-gray-900 dark:text-gray-100">
                                        ₹{event.price}
                                    </span>
                                )}
                            </div>
                            <Button
                                size="sm"
                                className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 dark:shadow-indigo-900/30 mt-2"
                                onClick={() => router.push(`/events/${event._id}`)}
                            >
                                View Details
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default EventCard;