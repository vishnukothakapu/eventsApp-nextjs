import connectToDB from "@/app/utils/config/db";
import Booking from "@/app/utils/models/Booking";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        await connectToDB();
        const { id } = params;
        if (!id) return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 });

        const booking = await Booking.findById(id).populate("event");
        if (!booking) {
            return NextResponse.json({ success: false, error: "No Booking found with ID " + id }, { status: 404 });
        }

        return NextResponse.json({ success: true, booking }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
