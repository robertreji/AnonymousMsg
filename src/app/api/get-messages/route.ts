import { connectdb } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOPtions } from "../auth/[...nextauth]/options";
import { ApiError } from "@/lib/error";
import userModel from "@/models/user";
import mongoose from "mongoose";

export async function GET(req:Request)
{
    await connectdb()
    const session = await  getServerSession(authOPtions)

    if(!session || !session.user)
    {
        return Response.json({
            success:false,
            message :"user not authenticated"},
            {status:401})
    }

    const userId = new mongoose.Types.ObjectId(session.user._id) 


try {
    const user =  await userModel.aggregate([
        {$match: {_id:userId}},
        {$unwind: {path: '$messages'}},
        {$sort: {'messages.createdAt': -1}},
        {$group: {_id:'$_id',messages: {$push: '$messages'}}}]
    )
    if(!user || user.length === 0) throw new ApiError("unable to retrive the messages ",402,false)
         
    return Response.json(
        {success:true, 
            messages:user[0].messages
        },
        {status:200}
        )

} catch (error) {
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
