import { NextResponse } from "next/server";
import Event from "@/app/utils/models/Event";
import Booking from "@/app/utils/models/Booking";
import connectToDB from "@/app/utils/config/db";
import { auth } from "@/app/auth";

export async function GET(req, { params }) {
    try {
        await connectToDB();
        const session = await auth();

        if (!session || !session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { eventId } = params;

        // Check if the logged-in user is the host of the event
        const event = await Event.findOne({ _id: eventId, host: session.user._id }).lean();
        if (!event) {
            return NextResponse.json({ error: "Event not found or not authorized" }, { status: 404 });
        }

        // Fetch bookings for the specific event
        const bookings = await Booking.find({ event: eventId })
            .populate("user", "name email profilePic")
            .lean();

        return NextResponse.json({ event, bookings }, { status: 200 });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
