"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarIcon, AlertCircle, CircleCheck, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const EditEvent = ({ params }) => {
  const router = useRouter();
  const { eventId } = params;

  const [event, setEvent] = useState({
    title: "",
    description: "",
    category: "",
    date: new Date(),
    time: "",
    location: "",
    price: 0,
    isOnline: false,
    onlineLink: "",
    image: null,
    imagePreview: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();
        if (data.success) {
          setEvent({
            ...data.event,
            date: new Date(data.event.date),
            imagePreview: data.event.image
          });
        } else {
          setError(data.error || "Failed to load event data");
        }
      } catch (err) {
        setError("Error fetching event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEvent({...event, image: file, imagePreview: imageUrl});
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", event.title);
      formData.append("description", event.description);
      formData.append("category", event.category);
      formData.append("date", event.date.toISOString());
      formData.append("time", event.time);
      formData.append("location", event.location);
      formData.append("price", event.price);
      formData.append("isOnline", event.isOnline);
      formData.append("onlineLink", event.onlineLink);
      if (event.image) {
        formData.append("image", event.image);
      }

      const response = await fetch(`/api/events/my-events/edit/${eventId}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setMessage("Event updated successfully!");
        setTimeout(() => router.push("/events/my-events"), 1500);
      } else {
        setError(result.msg || "Failed to update event");
      }
    } catch (err) {
      setError("An error occurred while updating the event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      const response = await fetch(`/api/events/my-events/edit/${eventId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Event deleted successfully!");
        setTimeout(() => router.push("/events/my-events"), 1500);
      } else {
        setError(data.error || "Failed to delete event");
      }
    } catch (err) {
      setError("Something went wrong. Please try again");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => router.push("/events/my-events")}
          >
            Back to My Events
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c111d] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {message && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-600 dark:border-green-400">
            <CircleCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-600 dark:text-green-400">Success</AlertTitle>
            <AlertDescription className="text-green-600 dark:text-green-400">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Event
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Update your event details
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleEditEvent} className="space-y-6">
              {/* Event Image */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Event Image</Label>
                <div className="flex flex-col items-center">
                  <label htmlFor="image" className="cursor-pointer">
                    <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 transition-colors">
                      {event.imagePreview ? (
                        <Image
                          src={event.imagePreview}
                          alt="Event Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                          Click to upload image
                        </div>
                      )}
                    </div>
                  </label>
                  <Input
                    type="file"
                    id="image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                  Event Title
                </Label>
                <Input
                  id="title"
                  value={event.title}
                  onChange={(e) => setEvent({...event, title: e.target.value})}
                  placeholder="Enter event name"
                  required
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              {/* Event Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={event.description}
                  onChange={(e) => setEvent({...event, description: e.target.value})}
                  placeholder="Tell people about your event"
                  rows={4}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              {/* Event Category */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Category</Label>
                <Select
                  value={event.category}
                  onValueChange={(value) => setEvent({...event, category: value})}
                >
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900">
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
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

              {/* Event Type */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Event Type</Label>
                <RadioGroup
                  value={event.isOnline ? "online" : "offline"}
                  onValueChange={(value) => setEvent({...event, isOnline: value === "online"})}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="offline" id="offline" className="peer sr-only" />
                    <Label
                      htmlFor="offline"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 peer-data-[state=checked]:border-indigo-600 [&:has([data-state=checked])]:border-indigo-600 cursor-pointer"
                    >
                      <span>Offline</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="online" id="online" className="peer sr-only" />
                    <Label
                      htmlFor="online"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 peer-data-[state=checked]:border-indigo-600 [&:has([data-state=checked])]:border-indigo-600 cursor-pointer"
                    >
                      <span>Online</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal dark:bg-gray-800 dark:border-gray-700"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {event.date ? format(event.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 dark:bg-gray-900">
                      <Calendar
                        mode="single"
                        selected={event.date}
                        onSelect={(date) => setEvent({...event, date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={event.time}
                    onChange={(e) => setEvent({...event, time: e.target.value})}
                    required
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>

              {/* Location or Online Link */}
              {event.isOnline ? (
                <div className="space-y-2">
                  <Label htmlFor="onlineLink" className="text-gray-700 dark:text-gray-300">
                    Online Event Link
                  </Label>
                  <Input
                    id="onlineLink"
                    value={event.onlineLink}
                    onChange={(e) => setEvent({...event, onlineLink: e.target.value})}
                    placeholder="https://example.com/event"
                    required
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={event.location}
                    onChange={(e) => setEvent({...event, location: e.target.value})}
                    placeholder="Enter venue address"
                    required
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              )}

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-700 dark:text-gray-300">
                  Price (₹)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={event.price}
                  onChange={(e) => setEvent({...event, price: e.target.value})}
                  placeholder="0 for free events"
                  required
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <Separator className="my-6" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 dark:shadow-indigo-900/30"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={handleDeleteEvent}
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Event
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditEvent;