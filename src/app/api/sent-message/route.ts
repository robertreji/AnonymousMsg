import { connectdb } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOPtions } from "../auth/[...nextauth]/options";
import { ApiError } from "@/lib/error";
import userModel, { message } from "@/models/user";
import mongoose from "mongoose";

export async function POST(req:Request)
{
    await connectdb()
    // const session = await  getServerSession(authOPtions)

    // if(!session || !session.user)
    // {
    //     return Response.json({
    //         success:false,
    //         message :"user not authenticated"},
    //         {status:401})
    // }
try {
    const {username,message} = await req.json()

    if(!username)throw new ApiError("username not recieved",400,false)

    const user = await userModel.findOne({username:username})

    if(!user) throw new ApiError("user not found ",400,false)
    
    if(!user.isAcceptingMsg) throw new ApiError("user is not accepting messaeges ",400,false)
    
    const newMsg = {content:message,createdAt:new Date()}
    user.messages.push(newMsg as message)
    await user.save()
    
    return Response.json({
            success:true,
            message :"message send succesfully"},
            {status:200})     
    }
catch (error) {
    if(error instanceof ApiError)
        {
        return Response.json(
            {success:error.success, 
                message :error.message
            },
                {status:error.status}
            )
            }
            return Response.json({
                success:false,
                message :"internal server error"},
                {status:500})     
            }
        }