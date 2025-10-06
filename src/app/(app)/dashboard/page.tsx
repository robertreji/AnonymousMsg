'use client'
import MsgCard from '@/components/msgCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { message } from '@/models/user'
import { acceptingMsgSchema } from '@/schemas/acceptMsgschema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

function Page() {
  const [messages,setMessages] = useState<message[]>([])
  const [isloading,setisLoading] = useState(false)
  const [isSwitchLoading,setIsswitchLoading] = useState(false)

  const  handleDeleteMsg =(messageId :string)=>
  {
    setMessages(messages.filter((msg)=>msg._id != messageId))
  }

  const {data:session} = useSession()


  const form = useForm(
    {
      resolver:zodResolver(acceptingMsgSchema)
    }
  )
  const { register,watch,setValue} = form
  const AcceptingMsg = watch("uisAcceptingMsg")

   const fetchAcceptMsg = useCallback(async()=>
    {
      setIsswitchLoading(true)
      try {
        const response = await axios.get("/api/accept-msg")
        setValue("uisAcceptingMsg",response.data.isAcceptingMsg)

      } catch (error :unknown) {
        if(error instanceof AxiosError)
        {
          console.log("something went wrong while fetching value of isAceptingMsg !")
        }
        console.log("error : ",error)
      }finally
      {
        setIsswitchLoading(false)
      }

   },[setValue])

  const fetchMessages = useCallback(async(refresh :boolean = false)=>
    {
      setisLoading(true)
      try {
        const reponse = await axios.get("/api/get-messages")
        setMessages(reponse.data.messages)
      } catch (error :unknown) {
        if(error instanceof AxiosError)
        {
          console.log(error.response)
        }
        console.log(error)
      }
      finally{
        setisLoading(false)
      }
    }
  ,[setisLoading,setMessages])

  async function handleSwitchChange(){
    try {
      const newValue = ! AcceptingMsg
       const reponse = await axios.post("/api/accept-msg",
        {
          isacceptingmsg:newValue
        }
       )
      setValue("uisAcceptingMsg",!AcceptingMsg)
    } catch (error) {
        if(error instanceof AxiosError)
        {
          console.log("something went wrong while fetching value of isAceptingMsg !")
        }
        console.log("error : ",error)
    }
  }

  useEffect(()=>{

    if(! session || ! session.user)return

    fetchMessages()
    fetchAcceptMsg()

  },[session,setValue,fetchAcceptMsg,fetchMessages])

  if(! session || ! session.user )
  {
    return <div>Please login</div>
  }
  const {username} = session.user

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copytoClipBoard = ()=>{
    navigator.clipboard.writeText(profileUrl)
  }

return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copytoClipBoard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('uisAcceptingMsg')}
          checked={AcceptingMsg}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {AcceptingMsg ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MsgCard
              key={index}
              message={message}
              onMsgDelete={handleDeleteMsg}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}



export default Page