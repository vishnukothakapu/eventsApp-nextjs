"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import EventCard from "@/app/components/EventCard";
import { cn } from "@/lib/utils";
import "./globals.css";
import EventsSkeleton from "@/app/components/EventsSkeleton";

const Homepage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [filterCategory, setFilterCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Fetch events
    const fetchEvents = useCallback(async () => {
        try {
            setLoadingEvents(true);
            const eventResponse = await fetch("/api/events");
            if (!eventResponse.ok) {
                throw new Error("Failed to fetch events.");
            }
            const eventsData = await eventResponse.json();
            if (eventsData.success) {
                setEvents(eventsData.events);
                setFilteredEvents(eventsData.events);
            } else {
                setError(eventsData.msg || "Error fetching events.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingEvents(false);
        }
    }, []);

    // Fetch user session
    const fetchUser = useCallback(async () => {
        try {
            setLoadingUser(true);
            const sessionResponse = await fetch("/api/auth/session");
            if (!sessionResponse.ok) {
                throw new Error("Failed to fetch user session.");
            }
            const session = await sessionResponse.json();
            setUser(session?.user || null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoadingUser(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
        fetchUser();
    }, [fetchEvents, fetchUser]);

    // Filter events based on search query and category
    useEffect(() => {
        let filtered = events;
        if (searchQuery) {
            filtered = filtered.filter((event) =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (filterCategory !== "All") {
            filtered = filtered.filter((event) => event.category === filterCategory);
        }
        setFilteredEvents(filtered);
    }, [searchQuery, filterCategory, events]);

    // Error state
    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    return (
        <div>
            {/* Header Section */}
            <div className="py-12 px-6 md:px-8 transition-all">
                <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="text-black dark:text-white space-y-6 px-2 ">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Explore, Connect, Experience!
                        </h1>
                        <p className="text-slate-900 text-lg md:text-xl dark:text-gray-200">
                            Find events that inspire you, connect with amazing people, and create unforgettable experiences. Whether it's a workshop, a concert, or a networking event, we've got you covered!
                        </p>
                        <div className="flex items-center gap-4">
                            <Button
                                className="rounded-md px-6 py-3 bg-indigo-700 text-white hover:bg-indigo-900 dark:bg-white dark:text-indigo-700 dark:hover:bg-gray-200 font-semibold"
                                onClick={() => {
                                    document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                               Explore Events
                            </Button>
                            <Button onClick={() => {router.push("/events/my-events")}}
                                className="rounded-md px-6 py-3 bg-transparent text-indigo-700 border border-indigo-700 hover:bg-indigo-700 hover:text-white  dark:bg-indigo-700  dark:text-white dark:hover:bg-indigo-900 font-semibold"
                            >
                                Host an Event
                            </Button>
                        </div>

                    </div>
                    <div className="flex justify-center md:justify-end">
                        <Image
                            src="/assets/images/bento-events.png"
                            width={500}
                            height={500}
                            alt="Event Illustration"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Events Section */}
            <div className="p-6 md:p-12 max-w-screen-xl mx-auto transition-all" id="events">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 border-b">
                    <div className="flex items-center relative w-full md:w-auto">
                        <Input
                            type="search"
                            className="w-full pl-8"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="w-5 h-5 stroke-gray-300 absolute left-2" />
                    </div>
                    <div className="w-full md:w-auto">
                        <Select onValueChange={setFilterCategory} defaultValue="All">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Technology">Technology</SelectItem>
                                    <SelectItem value="Education">Education</SelectItem>
                                    <SelectItem value="Entertainment & Fun">Entertainment & Fun</SelectItem>
                                    <SelectItem value="Professional & Business">Professional & Business</SelectItem>
                                    <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                                    <SelectItem value="Arts & Culture">Arts & Culture</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Events List */}
                {loadingEvents ? (
                    <EventsSkeleton />
                ) : filteredEvents.length > 0 ? (
                    <EventCard filteredEvents={filteredEvents} user={user} />
                ) : (
                    <p className="text-lg text-gray-700 text-center py-8">No events found.</p>
                )}
            </div>
        </div>
    );
};

export default Homepage;