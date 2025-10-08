import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import userModel from '@/models/user';
import { connectdb } from '@/lib/dbconnect';
import { AxiosError } from 'axios';
import { ApiError } from '@/lib/error';

type User=
    {
        id:string,
        username :string ,
        email : string,
        isAcceptingMsg : boolean,
        isVerified : boolean
    }


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'userName', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      type:"credentials",

      async authorize(credentials): Promise<User|null> {
        await connectdb();
        try {
            if (!credentials) {
                throw new Error('No credentials provided');
            }
          const userDoc = await userModel.findOne({
            username: credentials.username
          }).lean();
          if (!userDoc) {
            throw new Error('No user found with this email');
          }
          if (!userDoc.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            userDoc.password
          );
          if ( userDoc && isPasswordCorrect) {
            return {
                id:userDoc._id.toString(),
                username:userDoc.username,
                email:userDoc.email,
                isAcceptingMsg:userDoc.isAcceptingMsg,
                isVerified:userDoc.isVerified
            }
          } else {
            throw new Error('Incorrect password');
          }
        } catch (error: unknown) {
            if(error instanceof AxiosError)
            {
                throw new ApiError(error.message,404,false)
            }
            return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id; 
        token.isVerified = user.isVerified;
        token.isAceptingMsg = user.isAceptingMsg;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
      session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAceptingMsg = token.isAceptingMsg;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};