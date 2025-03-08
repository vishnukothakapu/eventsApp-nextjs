"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {useRouter} from "next/navigation";
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
import { AlertCircle, CircleCheck } from "lucide-react";
const AddEvent = () => {
    const router = useRouter();
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState(0);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const[onlineLink,setOnlineLink] = useState("");
    const [tags,setTags] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const today = new Date();
    const handleAddEvent = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const eventDetails = {
            name: eventName,
            description: eventDescription,
            category,
            date,
            time,
            location,
            price,
            isOnline,
            onlineLink,
            image,
        };

        try {
            const data = new FormData();
            data.append("name", eventName);
            data.append("description", eventDescription);
            data.append("category", category);
            data.append("date", date);
            data.append("time", time);

            if(location){
                data.append("location", location);
            }
            if(onlineLink){
                data.append("onlineLink", onlineLink);
            }
            data.append("image", image);
            data.append("price",price);
            console.log("Event details:", eventDetails);
            setMessage("Event added successfully!");
                const response = await fetch(`http://localhost:3000/api/add-event`,{
                    method: "POST",
                    body:data,
                });
                const result = await response.json();
                if(result.success){
                    console.log("Event details:", eventDetails);
                    setMessage("Event added successfully!");
                    router.push("/");
                    setError("");
                }
        }
        catch (err) {
            console.error(err);
            setError("An error occurred while adding the event.");
            setMessage("");
        }
        finally{
            setIsLoading(false);
        }
    };

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

            <Card className="max-w-lg w-full p-4 sm:p-6 mt-3 ">
                <CardHeader>
                    <CardTitle>Add Event</CardTitle>
                    <CardDescription>Make your event memorable</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddEvent} encType="multipart/form-data">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    id="name"

                                    onChange={(e) => setEventName(e.target.value)}
                                    placeholder="Enter Event name"
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    placeholder="Enter description about the event"
                                    onChange={(e) => setEventDescription(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={(value) => setCategory(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Category</SelectLabel>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Education">Education</SelectItem>
                                            <SelectItem value="Entertainment & Fun">Entertainment & Fun</SelectItem>
                                            <SelectItem value="Professional & Bussiness">Professional & Business</SelectItem>
                                            <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                                            <SelectItem value="Arts & Culture">Arts & Culture</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5 ">
                                <Label htmlFor="radio">Event Type</Label>
                                <RadioGroup className="w-full flex justify-around items-center bg-gray-100 dark:bg-[#161c27] px-3 py-2 h-10 rounded-md" id="radio"
                                            defaultValue="offline" onValueChange={(value) => {setIsOnline((value==="online"))}}>
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
                            {isOnline ? (
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="link">Event Link</Label>
                                    <Input
                                        type="text"
                                        id="link"

                                        onChange={(e) => setOnlineLink(e.target.value)}
                                        placeholder="Enter Event Link"
                                        required
                                    />
                                </div>
                            ): (
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        type="text"
                                        id="location"

                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Enter location"
                                        required
                                    />
                                </div>
                            )}

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="date">Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2"/>
                                            {date ? format(date, "PPP") : <span>Select Event Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            disabled={(day) => day < today}
                                            initialFocus
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
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    type="number"
                                    id="price"
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Enter price in INR"
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="image">Event Image</Label>
                                <Input
                                    type="file"
                                    className="cursor-pointer"
                                    id="image"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </div>
                        </div>
                        <CardFooter className="flex flex-col items-center mt-4 space-y-3 ">
                            <Button type="submit" className="w-full bg-indigo-700 text-white hover:bg-indigo-800" disabled={isLoading}>
                                {isLoading?"Adding...":"Add Event"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddEvent;
