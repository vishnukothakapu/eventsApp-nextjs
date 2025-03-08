import React from 'react'
import {Skeleton} from "@/components/ui/skeleton";

const EventsSkeleton = () => {
    return (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="flex flex-col hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-[#0c111d] dark:border rounded-md">
                    <Skeleton className="h-[200px] w-full rounded-t-md" />
                    <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="flex gap-3 items-center mb-4">
                            <Skeleton className="h-6 w-16 rounded-md" />
                            <Skeleton className="h-6 w-16 rounded-md" />
                        </div>
                        <Skeleton className="h-5 w-full mb-2" />
                        <Skeleton className="h-5 w-3/4 mb-4" />
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-8 w-16 rounded-md" />
                            <Skeleton className="h-8 w-24 rounded-md" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
export default EventsSkeleton
