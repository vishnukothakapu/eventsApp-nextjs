"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarIcon, AlertCircle, CircleCheck } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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

const EditEvent = ({ params }) => {
    const router = useRouter();
    const { eventId } = params;

    // Event state
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Event Data
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/events/${eventId}`);
                const data = await response.json();
                if (data.success) {
                    setEvent(data.event);
                } else {
                    setError("Failed to load event data.");
                }
            } catch (err) {
                setError("Error fetching event.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);
const handleImageChange=(e)=>{
    const file = e.target.files[0];
    if(file){
        const imageUrl = URL.createObjectURL(file);
        setEvent({...event,image:file,imagePreview:imageUrl});
    }
};
    // Handle Update Event
    const handleEditEvent = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const updatedEvent = new FormData();
            updatedEvent.append("title", event.title);
            updatedEvent.append("description", event.description);
            updatedEvent.append("category",event.category);
            updatedEvent.append("date",event.date);
            updatedEvent.append("time", event.time);
            updatedEvent.append("location",event.location);
            updatedEvent.append("price",event.price);
            updatedEvent.append("isOnline",event.isOnline);
            updatedEvent.append("onlineLink",event.onlineLink);
            updatedEvent.append("image",event.image);

        try {
            const response = await fetch(`/api/events/my-events/edit/${eventId}`, {
                method: "PUT",
                body: updatedEvent,
            });

            const result = await response.json();
            if (result.success) {
                setMessage("Event updated successfully!");
                setError("");
                router.push("/events/my-events");
            } else {
                setError(result.msg || "Failed to update event.");
            }
        } catch (err) {
            setError("An error occurred while updating the event.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleDeleteEvent = async (e) => {
        if(!event) return ;
        const confirmDelete = window.confirm("Are you sure want to delete this event?");
        if(!confirmDelete) return;
        try {
            const response = await fetch(`/api/events/my-events/edit/${eventId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.success) {
                setMessage("Event deleted successfully!");
                router.push("/events/my-events");
            } else {
                setError("Error deleting event: " + data.error);
            }
        }
        catch (err){
            console.error(err);
            setError("Something went wrong.please try again");
        }
    }
    if (loading) return <p>Loading event...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="mt-4 flex flex-col justify-center items-center">
            {error && (
                <Alert className="w-[500px] bg-transparent text-red-600 border border-red-600">
                    <AlertCircle className="h-5 w-5 stroke-red-600" />
                    <AlertTitle className="font-semibold">Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {message && (
                <Alert className="w-[500px] text-green-600 bg-transparent border border-green-600 mt-2">
                    <CircleCheck className="h-5 w-5 stroke-green-600" />
                    <AlertTitle className="font-semibold">Success</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}

            <Card className="w-[500px] mt-3 dark:bg-[#0c111d]">
                <CardHeader>
                    <CardTitle>Edit Event</CardTitle>
                    <CardDescription>Modify your event</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleEditEvent}>
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="image">Image</Label>
                                <Input
                                    type="file"
                                    className="hidden"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <div className="relative cursor-pointer"
                                     onClick={() => document.getElementById('image').click()}>
                                    {event.image && <Image src={event.image||event.imagePreview} alt="Event Image" width={200} height={200}
                                                           className="w-full rounded-md object-cover mb-2"
                                                           title="Click Image to Upload Photo"/>}
                                    {!event.image && <div
                                        className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-md">Click
                                        to Upload</div>}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    value={event.title}
                                    onChange={(e) => setEvent({...event, title: e.target.value})}
                                    placeholder="Enter Event name"
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    placeholder="Enter event description"
                                    value={event.description}
                                    onChange={(e) => setEvent({...event, description: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="category">Category</Label>
                                <Select value={event.category}
                                        onValueChange={(value) => setEvent({...event, category: value})}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Category</SelectLabel>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Education">Education</SelectItem>
                                            <SelectItem value="Entertainment & Fun">Entertainment & Fun</SelectItem>
                                            <SelectItem value="Professional & Bussiness">Professional &
                                                Business</SelectItem>
                                            <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                                            <SelectItem value="Arts & Culture">Arts & Culture</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5 ">
                                <Label htmlFor="radio">Event Type</Label>
                                <RadioGroup
                                    className="w-full flex justify-around items-center bg-gray-100 dark:bg-[#161c27] px-3 py-2 h-10 rounded-md"
                                    id="radio"
                                    value={event.isOnline?"online":"offline"}
                                    defaultValue="offline" onValueChange={(value) =>
                                    setEvent({...event,isOnline:value === "online"})}
                                    >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="offline" id="offline"/>
                                        <Label htmlFor="offline">Offline</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="online" id="online"/>
                                        <Label htmlFor="online">Online</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="date">Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left">
                                            <CalendarIcon className="mr-2"/>
                                            {event.date ? format(new Date(event.date), "PPP") : "Select Event Date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={new Date(event.date)}
                                            onSelect={(date) => setEvent({...event, date: date.toISOString()})}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    type="time"
                                    id="time"
                                    className=""
                                    value={event.time}
                                    onChange={(e) => setEvent({...event, time: e.target.value})}
                                    required
                                />
                            </div>
                            {event.isOnline ? (
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="link">Event Link</Label>
                                    <Input
                                        type="text"
                                        id="link"
                                        value={event.onlineLink}
                                        onChange={(e) => setEvent({...event, onlineLink: e.target.value})}
                                        placeholder="Enter Event Link"
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        type="text"
                                        id="location"
                                        value={event.location}
                                        onChange={(e) => setEvent({...event, location: e.target.value})}
                                        placeholder="Enter location"
                                        required
                                    />
                                </div>
                            )}
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    type="number"
                                    id="price"
                                    value={event.price}
                                    onChange={(e) => setEvent({...event, price: e.target.value})}
                                    placeholder="Enter price in INR"
                                    required
                                />
                            </div>
                        </div>
                        <CardFooter className="flex flex-col items-center mt-4 space-y-4">
                            <Button type="submit" className="w-full bg-indigo-700 text-white hover:bg-indigo-800"
                                    disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button onClick={handleDeleteEvent} className="bg-[#e23636] hover:bg-red-600 text-white w-full">Delete Event</Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditEvent;
