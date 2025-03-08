"use client";
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EventSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 font-poppins">
            <Card className="shadow-lg rounded-lg bg-white dark:bg-[#0c111d] dark:border">
                <CardHeader className="flex flex-col p-4 rounded-t-lg items-center">
                    <Skeleton className="w-full h-[300px] rounded-md mb-4" />
                    <Skeleton className="h-6 w-2/3 mb-2" />
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex gap-3 items-center">
                        <Skeleton className="h-6 w-24 rounded-md" />
                        <Skeleton className="h-6 w-24 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-full mt-6 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />

                    <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4 border-t rounded-b-lg">
                    <Skeleton className="h-10 w-20 rounded-md" />
                    <Skeleton className="h-10 w-32 rounded-md" />
                </CardFooter>
            </Card>

            <div className="border-b mt-8 py-2 text-xl font-bold">Related Events</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                {[...Array(4)].map((_, index) => (
                    <Card key={index} className="flex flex-col hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-[#0c111d] dark:border">
                        <CardHeader>
                            <Skeleton className="w-full h-[200px] rounded-t-md mb-2" />
                            <div className="flex gap-3 items-center">
                                <Skeleton className="h-6 w-20 rounded-md" />
                                <Skeleton className="h-6 w-20 rounded-md" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-5 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-2" />
                            <Skeleton className="h-4 w-1/3 mb-2" />
                        </CardContent>
                        <CardFooter className="flex justify-between font-medium items-center mt-4 border-t">
                            <Skeleton className="h-10 w-20 rounded-md" />
                            <Skeleton className="h-10 w-24 rounded-md" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default EventSkeleton;
