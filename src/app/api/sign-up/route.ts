import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiError } from "@/lib/error";
import userModel from "@/models/user";

import bcrypt from "bcryptjs";

export async function POST(Request:Request) {
  try {
        const {username,email,Password} = await Request.json()
        if(!(username && email && Password))throw new ApiError("all field are required",402,false)
      
        const existingUserVerifiedByUser  = await userModel.findOne(
            {
            username:username,
            isVerified:true
        })

        if(existingUserVerifiedByUser)
        {
            return Response.json({
                success :false,
                msg:"username already taken ",

            },{status:400 })
        }

        const existingUserByEmail = await userModel.findOne({email})
        const verifyCode = Math.floor(1000+Math.random()*9000).toString()

        if(existingUserByEmail)
        {
            if(existingUserByEmail.isVerified)
            {
                return Response.json({msg:"user alredy exists with this email id",sucess : false},{status:401})
            }
            existingUserByEmail.password = await bcrypt.hash(Password,10)
            existingUserByEmail.verifyCode = verifyCode
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
            await existingUserByEmail.save()
        }else{
            const hashedPass = await bcrypt.hash(Password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            const user = await  userModel.create({
                username,
                email,
                password:hashedPass,
                verifyCode:verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMsg:true,
                messages:[]
            })
        }
        const emailResponse =  await sendVerificationEmail(email,username,verifyCode)
        console.log(email)

        if(! emailResponse.success)
            {
                return Response.json({
                    success:false,
                    msg:emailResponse.msg
                },
            {
                status:500
            })
            }
        return Response.json({success:true, message :"user registered sucessfully ,please verify your email "},
        {status:200}
    )

    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message :"internal server error"
        },
    {
        status:500
    })
    }
}