import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(Request:Request) {
    await sendVerificationEmail()
    return Response.json("hehhe")
}