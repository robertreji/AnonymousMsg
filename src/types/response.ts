export interface ApiResponse{
    msg:string,
    sucess:boolean,
    isacceptingMsg?:boolean,
    messages?:Array<string>
}