import mongoose ,{Document} from "mongoose";

export interface message extends Document{
    content : string;
    createdAt :Date;
}

export interface user extends Document{
    username :string ,
    email : string,
    password : string,
    verifyCode : string,
    verifyCodeExpiry : Date,
    isAcceptingMsg : boolean,
    messages: message[],
    isVerified : boolean
}

const messageSchema = new mongoose.Schema<message>(
    {
        content:
        {
            type :String,
            required :true
        },
        createdAt:{
            type :Date,
            required : true,
            default : Date.now
        }
    }
    ,{timestamps:true})

const userSchema = new mongoose.Schema<user>(
    {
        username : {
            type :String,
            required : true
        },
        email : {
            type :String,
            required : true
        },
        password : {
            type :String,
            required : true
        },
        verifyCode : {
            type :String
        },
        isAcceptingMsg : {
            type : Boolean,
            default : true
        },
        messages : [messageSchema],
        verifyCodeExpiry :{type : Date},
        isVerified :{
            type : Boolean,
            default : false
        }
        
    }
    ,{timestamps:true})

const user =     mongoose.models.user as mongoose.Model<user> 
                    ||
                mongoose.model<user>("user",userSchema)
                
export default user;