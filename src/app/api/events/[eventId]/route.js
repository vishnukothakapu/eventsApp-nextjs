import connectToDB from "@/app/utils/config/db";
import Event from "@/app/utils/models/Event";
import {NextResponse} from "next/server";
export async function GET(request,{params}){
    try {
        const {eventId}=params;
        await connectToDB();
        const event = await Event.findById(eventId).populate("host","name").exec();
        if(!event){
            return NextResponse.json({success:false,error: "No event found with id "+ eventId},{status:404});
        }
        return NextResponse.json({success:true,event},{ status:200 });
    }
    catch(error){
        console.error(error);
        return NextResponse.json({success:false,error:error.message},{status:500});
    }
}