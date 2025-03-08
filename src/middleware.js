import {NextResponse} from "next/server";
import {getToken} from 'next-auth/jwt';
export async function middleware(req){
    const path = req.nextUrl.pathname;
    const token = await getToken({req,secret:process.env.SECRET_KEY});
    if(token){
        if(path==="/login"||path==="/register"){
            return NextResponse.redirect(new URL("/",req.url));
        }
    }
    // console.log(token);
    // console.log(path);
    return NextResponse.next();
}
export const config = {
    matcher:["/login","/register"],

}