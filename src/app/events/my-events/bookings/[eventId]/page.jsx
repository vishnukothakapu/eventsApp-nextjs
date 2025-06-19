"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const EventBookingsPage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!eventId) return;

        const fetchBookings = async () => {
            try {
                const res = await fetch(`/api/events/bookings/${eventId}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch bookings");
                }
                const data = await res.json();
                setEvent(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [eventId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!event) return <p>No event found.</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Bookings for {event.title}</h1>
            {event.bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <Table>
                    <TableCaption>Bookings for {event.title}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead>Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {event.bookings.map((booking) => (
                            <TableRow key={booking._id}>
                                <TableCell className="flex items-center gap-2">
                                    <img
                                        src={booking.user.profilePic}
                                        alt={booking.user.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    {booking.user.name}
                                </TableCell>
                                <TableCell>{booking.user.email}</TableCell>
                                <TableCell>{booking.status}</TableCell>
                                <TableCell>{booking.paymentMethod || "N/A"}</TableCell>
                                <TableCell>${booking.price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default EventBookingsPage;
