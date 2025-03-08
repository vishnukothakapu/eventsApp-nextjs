import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
    try {
        const { amount } = await req.json();

        const options = {
            amount: amount,
            currency: "INR",
            receipt: "order_receipt_1",
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json({ order_id: order.id });
    } catch (err) {
        console.error("Error creating order:", err);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}