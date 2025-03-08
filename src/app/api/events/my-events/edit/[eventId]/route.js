import connectToDB from "@/app/utils/config/db";
import Event from "@/app/utils/models/Event";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import {writeFile,mkdir} from 'fs/promises';
import path from "path";
import {get} from "mongoose";
export async function GET(req, { params }) {
    try {
        const { eventId } = params;
        await connectToDB();
        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({ success: false, msg: "No event found." }, { status: 404 });
        }
        return NextResponse.json({ success: true, event });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToDB();
        const { eventId } = params;
        const data = await req.formData();
        const title = data.get("title");
        const description = data.get("description");
        const category = data.get("category");
        const date = data.get("date");
        const time = data.get("time");
        const location = data.get("location");
        const price = data.get("price");
        const isOnline = data.get("isOnline");
        const onlineLink = data.get("onlineLink");
        const image = data.get("image");
        let imageUrlPath=null;
        if(image){
            const bufferData = await image.arrayBuffer();
            const buffer = Buffer.from(bufferData);
            const uploadsDir = path.join(process.cwd(),"public","uploads");
            await mkdir(uploadsDir,{recursive:true});
            const filename = path.basename(image.name);
            imageUrlPath=path.join(uploadsDir,filename);
            await writeFile(imageUrlPath,buffer);
            imageUrlPath=`/uploads/${filename}`;
        }
        const updatedEventData = {
            title,
            description,
            category,
            date,
            time,
            location,
            price,
            isOnline,
            onlineLink,
            image: imageUrlPath,
        };
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedEventData, { new: true });

        if (!updatedEvent) {
            return NextResponse.json({ success: false, msg: "Event not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, event: updatedEvent });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: "Server error." }, { status: 500 });
    }
}
export async function DELETE(req, { params }) {
    try {
        await connectToDB();
        const {eventId} = params;
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return NextResponse.json({success:false,error:"Event not found"},{status:404})
        }
        return NextResponse.json({ success: true,message:"Event deleted successfully"},{status:200});
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({success:false,error:err.message},{status:500});
    }
}
