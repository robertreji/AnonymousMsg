import { connectdb } from "@/lib/dbconnect"
import { ApiError } from "@/lib/error"
import userModel from "@/models/user"
import { getServerSession } from "next-auth"
import { authOPtions } from "../auth/[...nextauth]/options"

export async function DELETE(req: Request) {
  try {
    await connectdb()
    const session = await getServerSession(authOPtions)
    if(!session || !session.user) {
      return Response.json({ success:false, message:"user not authenticated" }, { status:401 })
    }

    const { searchParams } = new URL(req.url)
    const msgId = searchParams.get("msgId")
    if(!msgId) throw new ApiError("msgId not received", 400, false)

    const result = await userModel.updateOne(
      { _id: session.user._id },
      { $pull: { messages: { _id: msgId } } }
    )

    if(result.modifiedCount === 0)
      return Response.json({ message:"message not found" }, { status:404 })

    return Response.json({ message:"message deleted successfully" }, { status:200 })
  } catch (error) {
    console.error(error)
    return Response.json({ message:"Internal server error", error }, { status:500 })
  }
}
