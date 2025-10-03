'use client'
import {  FormProvider,useForm } from "react-hook-form"
import { useState } from "react"
import {  redirect, useRouter } from "next/navigation"
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import { FormControl, FormField, FormItem, FormLabel,FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Loader2} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { verifyCode } from "@/schemas/verifySchema"
import { signInSchema } from "@/schemas/signInschema"
import { signIn } from "next-auth/react"
function SignUpPage() {

    const [isSubmitting,setIsSubmitting] = useState(false)
      const [errorMsg, setErrorMsg] = useState("")

    const router = useRouter()

    const form = useForm({
        resolver :zodResolver(signInSchema),
        defaultValues:
        {
          username:'',
          password:''
        }
    })

    async function onsubmit(data:z.infer<typeof signInSchema>)
    {
        setIsSubmitting(true)
       const response = await  signIn("credentials",{
            redirect:false,
            username:data.username,
            password: data.password
        })

        if(response?.error)
        {
            setErrorMsg(response.error)
            setIsSubmitting(false)
        }
        else{
            setIsSubmitting(false)
            router.replace("/")   
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
                  Sign In
                </h1>
            </div>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Enter username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Enter your password </FormLabel>
                                <FormControl>
                                    <Input  type="password" placeholder="********" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            errorMsg&&<p className="text-red-500 text-sm">{errorMsg}</p>
                        }
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting?(
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Signing in....
                                </>
                                ):("signIn")
                            }
                        </Button>
                </form>
            </FormProvider>
        </div>
    </div>
  )
}

export default SignUpPage