import connectToDB from "@/app/utils/config/db";
import Event from '@/app/utils/models/Event';
import {NextResponse} from "next/server";
export async function GET(){
    await connectToDB();
    try {
        const events = await Event.find({}).populate("host","name _id").exec();
        if(events&&events.length>0){
            return NextResponse.json({success:true,events},{status:200});
        }
        else {
            return NextResponse.json({success:false,msg:"No events found."},{status:404});
        }

    }
    catch(err){
        return NextResponse.json({success:false,msg:"Error While Fetching Events"},{status:500});
        console.log(err);
    }
}