"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const BookingDetailsPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qrCode, setQrCode] = useState("");

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            day: "2-digit",
            month: "short",
        });
    };

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await fetch(`/api/bookings/${id}`);
                if (!res.ok) throw new Error("Failed to fetch booking");
                const data = await res.json();
                if (!data.success) throw new Error(data.error || "Booking not found");

                setBooking(data.booking);

                // Generate QR Code
                const qrData = `Booking ID: ${data.booking.orderId}`;
                const qrImageData = await QRCode.toDataURL(qrData);
                setQrCode(qrImageData);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching booking:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
    if (error) return <p className="text-center text-lg font-semibold text-red-500">{error}</p>;
    if (!booking) return <p className="text-center text-lg font-semibold">Booking not found.</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-[#0c111d] border rounded-lg shadow-md mt-4">
            <h1 className="text-2xl font-bold mb-4">{booking.event?.title || "Event"}</h1>

            {booking.event?.image && (
                <div className="relative w-full h-60 mb-4">
                    <Image
                        src={booking.event.image}
                        alt={booking.event.title}
                        fill
                        loading="lazy"
                        className="rounded-md object-cover"
                    />
                </div>
            )}

            <div className="flex items-center justify-between gap-6">
                <div class="">
                    <p className="my-4 w-[200px] font-medium text-white dark:text-[#75e0a7] bg-green-600 border dark:border-[#75e0a7] dark:bg-[#053321] px-2 py-1 rounded-md text-center">
                        {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                    </p>
                    <p><strong>Booking ID:</strong> EVT{booking._id}</p>
                    <p><strong>Date:</strong> {formatDate(booking.event?.date)}</p>
                    <p><strong>Time:</strong> {booking.event?.time}</p>
                    <p><strong>Location:</strong> {booking.event?.location || "N/A"}</p>
                    <p><strong>Mode:</strong> {booking.event?.isOnline ? "Online" : "Offline"}</p>
                    <p><strong>Price:</strong> ₹{booking.price}</p>
                </div>

                {qrCode && (
                    <div className="flex flex-col items-center">
                        <p className="mb-2 text-lg font-semibold">Ticket QR Code</p>
                        <Image src={qrCode} width={150} height={150} alt="QR Code" />
                    </div>
                )}
            </div>
<div>

</div>
            <div className="mt-6 border-t pt-4">
                <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
                <p><strong>Transaction ID:</strong> {booking.paymentId}</p>
                <p><strong>Payment Date:</strong> {formatDate(booking.bookedAt)}</p>
                <p><strong>Payment Mode:</strong> {booking.paymentMethod.toUpperCase()} ({booking.paymentBank})</p>


            </div>

            <div className="mt-6 flex justify-between">
                <Button onClick={() => router.push("/my-bookings")}>
                    Back to Bookings
                </Button>
                <Button onClick={() => generatePDF(booking)} className="bg-indigo-700 text-white">
                    Download Ticket
                </Button>
            </div>
        </div>
    );
};

export default BookingDetailsPage;
