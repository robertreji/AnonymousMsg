import userModel from "@/models/user";
import { connectdb } from "@/lib/dbconnect";
import { ApiError } from "@/lib/error";


export async function POST(req:Request) {
    await connectdb()

    try {
        const {username,otp} = await req.json() 
        if(!(username&&otp)) throw new ApiError("username and otp is required",400,false)

        const user = await userModel.findOne({
            username:username
        })
        if(!user) throw new ApiError("user not found ",400,false)

        if( user.verifyCode === otp){
            if(new Date(user.verifyCodeExpiry)>new Date())
            {
                user.isVerified=true
                await user.save()
                 return Response.json({
                    success:true,
                    message :"otp verified successfullly]"},
                    {status:200})
            }else{
                return Response.json({
                    success:false,
                    message :"otp is expired please sighn-up again"},
                    {status:400})
            }
        }else{
            return Response.json({
                    success:false,
                    message :"otp entered is wrong"},
                    {status:400})
        }

    } catch (error :unknown) {
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