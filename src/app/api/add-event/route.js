import connectToDB from "@/app/utils/config/db";
import {NextResponse} from "next/server";
import {writeFile,mkdir} from 'fs/promises';
import Event from "@/app/utils/models/Event";
import path from "path";
import {auth} from '@/app/auth'
export async function GET() {
    await connectToDB();
    return NextResponse.json({msg:"Api Testing"});
}
export async function POST(request) {
    await connectToDB();
    const session = await auth();
    const user = session?.user;
    const data = await request.formData();
    const title = data.get("name");
    const description = data.get("description");
    const category = data.get("category");
    const date = data.get("date");
    const time = data.get("time");
    const location = data.get("location");
    const onlineLink = data.get("onlineLink");
    const isOnline = data.get("isOnline")==="true";
    const price = parseFloat(data.get("price"));
    const image=data.get("image");
    let imageUrlPath=null;
    const bufferData = await image.arrayBuffer();
    const buffer = Buffer.from(bufferData);
    const uploadsDir = path.join(process.cwd(),"public","uploads");
    await mkdir(uploadsDir,{recursive:true});
    const filename = path.basename(image.name);
    imageUrlPath=path.join(uploadsDir,filename);
    try {
        await writeFile(imageUrlPath,buffer);
        imageUrlPath=`/uploads/${filename}`;
        const newEvent = new Event({
            title,
            description,
            category,
            date,
            time,
            location,
            price,
            host:user.id,
            isOnline,
            onlineLink,
            image:imageUrlPath,
        });
        await newEvent.save();
        return NextResponse.json({response:'Successfully Uploaded',success:true},{status:201})
    }
    catch(error){
        console.log(error);
        return NextResponse.json({success:false},{status:500});
    }
}