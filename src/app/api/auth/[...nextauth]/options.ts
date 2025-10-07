import { NextAuthOptions, User } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectdb } from "@/lib/dbconnect";
import userModel from "@/models/user";
import { ApiError } from "@/lib/error";
import {user} from "@/models/user"


export const authOPtions :NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                username: { label: "username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password" }
            },
async authorize(credentials): Promise<User & { isVerified: boolean; isAceptingMsg: boolean } | null> {
    await connectdb()
    try {
      const user =  await userModel.findOne({
            username:credentials?.username
        })
        if(!user?.isVerified)throw new ApiError("please verify your account  before login ",401,false)
        if(!user)throw new ApiError("user not found",401,false)

        const isPassCorerct =await bcrypt.compare(credentials?.password || "fuigyr",user.password)
        if(isPassCorerct){
            return {
                id: (user._id as string | { toString(): string }).toString(), // required
                name: user.username,     // optional
                email: user.email || undefined, // optional
                isVerified: user.isVerified,    // custom
                isAceptingMsg: user.isAcceptingMsg, // custom
            } as User & { isVerified: boolean; isAceptingMsg: boolean };
        }else{
            throw new ApiError("incorrect password ",400,false)
        }
    } catch (error) {
        console.log(error)
        throw new ApiError("something went wrong ",400,false)
      
    }
}
        
        })
    ],
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
    callbacks:{
        async jwt({ token, user }) {
            if(user)
            {
                token._id=user._id?.toString()
                token.isVerified=user.isVerified
                token.isAceptingMsg= user.isAceptingMsg
                token.username= user.username
            }
        return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id= token._id
                session.user.isVerified=token.isVerified
                session.user.isAceptingMsg=token.isAceptingMsg
                session.user.username=token.username
            }
        return session
        }
    }
    
}