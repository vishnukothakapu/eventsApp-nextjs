import {NextResponse} from "next/server";
import Razorpay from "razorpay";
import connectToDB from "@/app/utils/config/db";
import Event from "@/app/utils/models/Event";
import Booking from "@/app/utils/models/Booking";
import {auth} from '@/app/auth';
import uniqid from 'uniqid';
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export async function GET(req,{params}){
    try {
        await connectToDB();
        const {eventId} = params;
        const event = await Event.findById(eventId).populate("host","name").exec();
        if(!event){
            return NextResponse.json({success:false,error:"Event not found"},{status:404});
        }
        return NextResponse.json({success:true,event});
    }
    catch(err){
        console.error(err);
        return NextResponse.json({success:false,error:err},{status:500});
    }
}
export async function POST(req,{params}){
    try {
        await connectToDB();
        const session = await auth();
        const user = session?.user;
        const {eventId} = params;
        const {amount}= await req.json();

        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({success:false,error: "Event not found"},{status:404});
        }
        const order = await razorpay.orders.create({
            amount:amount,
            currency:"INR",
            receipt:`receipt_${Date.now()}`,
        });
        const booking = new Booking({
            event:event._id,
            user:user.id,
            price:amount/100,
            orderId:order.id,
            paymentId:"",
            paymentSign:"",
            paymentMethod:"",
            paymentBank:"",
            status:"pending",
        });
        await booking.save();
        return NextResponse.json({success:true,order_id:order.id});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({success:false,error:err},{status:500});
    }
}
export async function PUT(req,{params}){
    try {
        await connectToDB();
        const session = await auth();
        const user = session?.user;
        const {eventId} = params;
        const {paymentId,orderId,signature}=await req.json();
        const booking = await Booking.findOne({orderId});
        if (!booking) {
            return NextResponse.json({success:false,error:"Booking not found"},{status:404});
        }
        const payment = await razorpay.payments.fetch(paymentId);

        if(!payment || payment.status!=="captured"){
            return NextResponse.json({success:false,error:"Payment failed. Please try again."},{status:400});
        }
        console.log("Payment Bank:",payment.method);
        console.log("Payment Method:",payment.method);
        const bookingDoc = {
            paymentId,
            paymentSign:signature,
            paymentMethod:payment.method||"",
            paymentBank:payment.bank||"",
            status:"confirmed",
        }
        console.log("Booking Doc:",bookingDoc);
        console.log("Booking Doc Payment Bank:",bookingDoc.paymentBank);
        console.log("Booking Doc Payment Method:",bookingDoc.paymentMethod);
       const updatedBooking = await Booking.findOneAndUpdate({orderId},{$set:bookingDoc},{new:true});
       console.log("Updated Booking:",updatedBooking);
        return NextResponse.json({ success: true, booking:updatedBooking });
    }
    catch(err){
        console.error(err);
        return NextResponse.json({success:false,error:err.message},{status:500});
    }
}