import axios from "axios";
import { render } from "@react-email/render";
import { SendEmailTemplate } from "../../emails/sendverificationcodeTemplate";

interface ApiResponse {
  msg: string;
  success: boolean;
}

export async function sendVerificationEmail(
  email?: string,
  username?: string,
  verifycode?: string
): Promise<ApiResponse> {
  try {
    const htmlContent = await render(
      <SendEmailTemplate
        username={username || "friend"}
        otp={verifycode || "57394"}
      />
    );

    const data = {
      personalizations: [
        {
          to: [{ email: email || "robertreji2005@gmail.com" }],
          subject: "Verification - AnonymousMsg",
        },
      ],
      from: { email: "robertreji2005@gmail.com" },
      content: [{ type: "text/html", value: htmlContent }],
    };

    const response = await axios.post("https://api.sendgrid.com/v3/mail/send", data, {
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return { msg: "Email sent successfully", success: true };
    } else {
      console.error("SendGrid error:", response.data);
      return { msg: "Failed to send email", success: false };
    }
  } catch (error: any) {
    console.error("Error sending email:", error.response?.data || error.message);
    return { msg: "An error occurred while sending email", success: false };
  }
}
