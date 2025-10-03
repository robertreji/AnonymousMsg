'use client'
import {  FormProvider,useForm } from "react-hook-form"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import axios, { AxiosError } from 'axios'
import { FormControl, FormField, FormItem, FormLabel,FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Loader2} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { verifyCode } from "@/schemas/verifySchema"
function SignUpPage() {

    const {username} = useParams()
    const [verificationStatus,setverificationStatus]= useState('')
    const [isSubmitting,setIsSubmitting] = useState(false)
    
    const router = useRouter()

    const form = useForm({
        resolver :zodResolver(verifyCode),
        defaultValues:
        {
          code:''
        }
    })

    async function onsubmit(data:z.infer<typeof verifyCode>)
    {
        setIsSubmitting(true)
        try {
             const Data = {
              otp:data.code,
              username:username
             }
            const response = await axios.post("/api/verify-Code",Data)
            console.log("responseee:",response)
            setverificationStatus(response.data.message)
            setIsSubmitting(false)
            router.replace("/")
        } catch (error :unknown) { 
            if(error instanceof AxiosError)
            { 
                if (error.response && error.response.data) {
                 setverificationStatus(error.response.data.message)
                }
                else {
                    setverificationStatus("Something went wrong")
                }
            }
            setIsSubmitting(false)
        }
    }
  return (
    <div className="flex justify-center items-center
    min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white
         rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold 
                 tracking-tight lg:text-5xl mb-6">
                   Verify Your Account
                </h1>
            </div>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Enter the verification code </FormLabel>
                            <FormControl>
                                <Input placeholder="verification code.." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>                        
                        )}
                        />
                        {
                   
                            <p className={`text-sm ${verificationStatus==="otp entered is wrong"?"text-red-500":"text-green-500"}`}>
                                {verificationStatus}
                            </p>
                        }
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting?(
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>verifying....
                                </>
                                ):("verify")
                            }
                        </Button>
                </form>
            </FormProvider>
        </div>
    </div>
  )
}

export default SignUpPage