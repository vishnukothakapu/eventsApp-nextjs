"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Sparkles, Calendar, MapPin, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
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

  const fetchEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const eventResponse = await fetch("/api/events");
      if (!eventResponse.ok) throw new Error("Failed to fetch events.");
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

  const fetchUser = useCallback(async () => {
    try {
      setLoadingUser(true);
      const sessionResponse = await fetch("/api/auth/session");
      if (!sessionResponse.ok) throw new Error("Failed to fetch user session.");
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-xl shadow-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Discover amazing events</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 dark:from-gray-100 dark:via-gray-300 dark:to-gray-500 bg-clip-text text-transparent">
              Where Moments Become <span className="text-indigo-600 dark:text-indigo-400">Memories</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Find, create, and share unforgettable experiences. From concerts to workshops, we connect you with events that matter.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30"
                onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
              >
                Browse Events
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-gray-900 dark:border-gray-200 hover:bg-gray-900 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors"
                onClick={() => router.push(user ? "/events/my-events" : "/register")}
              >
                Create Event
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium">1000+ Events</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium">50+ Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium">10K+ Attendees</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-square w-full h-auto rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/assets/images/bento-events.png"
                alt="People enjoying an event"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 w-40">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Trending Now</div>
              <div className="font-bold truncate">Summer Music Festival</div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 w-40">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Coming Soon</div>
              <div className="font-bold truncate">Tech Conference</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 md:py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Upcoming Events</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find events that match your interests and schedule
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              className="w-full pl-10 pr-4 py-6 text-lg"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select onValueChange={setFilterCategory} defaultValue="All">
              <SelectTrigger className="w-full py-6 text-lg">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Entertainment & Fun">Entertainment</SelectItem>
                  <SelectItem value="Professional & Business">Business</SelectItem>
                  <SelectItem value="Health & Wellness">Wellness</SelectItem>
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
          <div>
            <EventCard filteredEvents={filteredEvents} user={user} />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No events found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <Button
              variant="ghost"
              className="mt-6"
              onClick={() => {
                setSearchQuery("");
                setFilterCategory("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 sm:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Create Your Own Event?</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Join thousands of organizers who are creating unforgettable experiences for their communities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold bg-white text-indigo-600 hover:bg-gray-100 shadow-lg"
              onClick={() => router.push(user ? "/events/create" : "/register")}
            >
              Start Hosting
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-white text-white hover:bg-white/10"
              onClick={() => router.push("/about")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;