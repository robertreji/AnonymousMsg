'use client'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { message } from "@/models/user"
import  { Types } from "mongoose"
import axios from "axios"

type messageProps={
    message:message,
    onMsgDelete :(msgId:string)=>void
}

function MsgCard({message,onMsgDelete}:messageProps) {

    async function handleMsgDelete()
    {
        const MsgId= String(message._id)
        await axios.delete(`/api/delete-msg?msgId=${message._id}`)
        onMsgDelete(MsgId)
    }

  return (
    <Card>
        <CardHeader>
            <CardTitle>{message.content}</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">Delete msg</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure, to delete the msg?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        message.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>handleMsgDelete()}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardHeader>
    </Card>
  )
}

export default MsgCard