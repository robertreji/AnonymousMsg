import { resend } from "@/lib/resend";
import { SendEmailTemplate } from "../../emails/sendverificationcodeTemplate";
import { ApiResponse } from "@/types/response";

export async function sendVerificationEmail(
  email?: string,
  username?: string,
  verifycode?: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email || "robertreji2005@gmail.com", 
      subject: "Verification anonymousmsg",
      react: <SendEmailTemplate username={username || "friend"}  otp={ verifycode ||"57394"}/>,
    });

    if (error) {
      console.error("error sending email!", error);
      return { msg: "an error occurred", sucess: false };
    }

    return { msg: "successfully sent email", sucess: true };
  } catch (error: unknown) {
    console.error(error);
    return { msg: "an error occurred", sucess: false };
  }
}
