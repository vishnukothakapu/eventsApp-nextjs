import connectToDB from "@/app/utils/config/db";
import Event from '@/app/utils/models/Event';
import {NextResponse} from "next/server";
import {auth} from '@/app/auth';
export async function GET(){

    try {
        await connectToDB();
        const session = await auth();
        if(!session||!session.user){
            return NextResponse.json({success:false,error:"User not authenticated.Please Login"},{status:401});
        }
        const events = await Event.find({host:session.user.id}).populate("host","name _id").exec();
        if(events&&events.length>0){
            return NextResponse.json({success:true,events},{status:200});
        }
        else {
            return NextResponse.json({success:false,msg:"No events found."},{status: 404});
        }
    }
    catch(err){
        console.error("Error fetching user events:",err);
        return NextResponse.json({success:false,msg:"Error While Fetching Events"},{status: 500});

    }
}