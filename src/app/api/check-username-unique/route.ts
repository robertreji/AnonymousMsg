import {success, z} from "zod"
import userModel from "@/models/user"
import { connectdb } from "@/lib/dbconnect"
import { ApiError } from "@/lib/error"
import { ApiResponse } from "@/types/response"

const validationQuerySchema = z.object({
    username: z.string()
    .min(2,"minimum 2 characters")
    .max(12,"max 12 characters").regex(/^[a-zA-Z0-9_]+$/,"no special characters")
})

export async function GET(req:Request){

    await connectdb()
    try {

        const {searchParams} = new URL(req.url)
        const params={username:searchParams.get("username")}
        const results = validationQuerySchema.safeParse(params)

        if(!results.success)throw new ApiError("invalid username format",401,false)

        const {username} =results.data
        const useralreadyExists = await userModel.findOne({
            username:username,
            isVerified:true
        })
        if(useralreadyExists){
            throw new ApiError("username already taken ",200,false)
        }

        return Response.json({message:"username available"},{status:200})
    } catch (error:unknown) {
        if(error instanceof ApiError)
        {
        return Response.json({success:error.success, message :error.message},{status:error.status})
        }
        return Response.json({
            success:false,
            message :"internal server error"},
            {status:500})
    }
}