'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { messagesSchema } from '@/schemas/messageschema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, LoaderIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm} from 'react-hook-form'

type messagesSchema={
  content:string
}

function Page() {
  const {username} = useParams()
  const [isUserAceptingMsg,setIsUserAcceptingmsg] = useState(true)
  const [issending,setIssending] = useState(false)
  const [messageSentStatus,setmessageSentStatus] = useState(false)

  const form = useForm({
    resolver:zodResolver(messagesSchema)
  })

  const {register,handleSubmit} = form

 async function onSubmit(msg :messagesSchema)
  {
    const data={
      username:username,
      message : msg.content
    }
    try {
      setIssending(true)
      await axios.post("/api/sent-message",data)
      setIsUserAcceptingmsg(true)
      setmessageSentStatus(true)
    } catch (error) {
      if(error instanceof AxiosError)
      {
        setIsUserAcceptingmsg(error.response?.data.success)
      }
    }finally{
      setIssending(false)

    }
  }

  return (
    <div className= 'min-h-screen  flex flex-col mt-[100px]  items-center min-w-screen'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-6'>
        <label className='text-[45px] font-extrabold'> Send anonymous message to : {username}</label>
          <Input 
            type='text' {...register("content") }
            placeholder="enter msg here.."
            className='w-[600px] h-[50px]'/>
            {
              ! isUserAceptingMsg&&<><p className='text-red-500 text-sm'>user is not accepting message </p></>
            }
            
          {
            issending ?<>
              <Button className='max-w-24 flex-grow flex space-x-2 hover:scale-[.98]' type='submit'><Loader2 className='animate-spin'/>sending.....</Button>
            </>
            :
            <>
            <Button className='w-22 hover:scale-[.98]' type='submit'>sent Msg</Button>
            {
              (isUserAceptingMsg && messageSentStatus)&&<p className='text-green-400 font-semibold'>message sent sucessfully </p>
            }
            </>
          }
      </form>     
    </div>
  )
}

export default Page