import { connectdb } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOPtions } from "../auth/[...nextauth]/options";
import { ApiError } from "@/lib/error";
import userModel from "@/models/user";

export async function POST(req:Request)
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

    const user = session.user

 

   try {
    const {isacceptingmsg} = await req.json()

    const updatedUser = await userModel.findByIdAndUpdate(user._id,
        {isAcceptingMsg : isacceptingmsg},
        {new:true}) 

    if(!updatedUser)throw new ApiError("unable to update the isAcceptingmsg section",400,false)
   return Response.json({
            success:true,
            message :"updated isacceptingms section"},
            {status:200})
    } catch (error :unknown) {
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
export async function GET(req:Request)
{
    const session = await  getServerSession(authOPtions)

    if(!session || !session.user)
    {
        return Response.json({
            success:false,
            message :"user not authenticated"},
            {status:401})
    }

    const user = session.user

    try {
        const foundUser = await userModel.findById(user._id)

        if(!foundUser) throw new ApiError("user not found ",400,false)
        
        return Response.json({
            success:true,
            isAcceptingMsg :foundUser.isAcceptingMsg},
            {status:200})    
    
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