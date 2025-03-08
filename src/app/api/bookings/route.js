import { NextResponse } from "next/server";
import Booking from "../../utils/models/Booking"
import connectToDB from "@/app/utils/config/db";
import { auth } from '@/app/auth';

export async function GET(req) {
    try {
        await connectToDB();
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const bookings = await Booking.find({ user: session.user.id }).populate("event");

        return NextResponse.json(bookings);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

