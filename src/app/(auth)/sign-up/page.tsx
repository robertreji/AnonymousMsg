'use client'
import { Form, FormProvider,useForm } from "react-hook-form"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/sighnUpschema"
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import axios from 'axios'
import { FormControl, FormField, FormItem, FormLabel,FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Loader2} from 'lucide-react'
import { Button } from "@/components/ui/button"
function SignUpPage() {

    const [userName,setUserName] = useState('')
    const [userNameMsg,setUserNameMsg] = useState('')
    const [isCheckingUsername,setIsCherckingUserName] = useState(false)
    const [isSubmitting,setIsSubmitting] = useState(false)
    const debouncedUserName = useDebounceCallback(setUserName, 300)
    const router = useRouter()

    const form = useForm({
        resolver :zodResolver(signUpSchema),
        defaultValues:
        {
            username:'',
            email:'',
            Password:''
        }
    })

    useEffect(()=>{
        async function checkusernameUnique()
            {
                if(userName)
                {
                    setIsCherckingUserName(true)
                    setUserNameMsg('')
                    try {
                        const response =await axios.get(`/api/check-username-unique?username=${userName}`)
                        setUserNameMsg(response.data.message)
                    } catch (error) {
                        console.log("error occured during checking unique username ",error)
                    }
                    finally{
                        setIsCherckingUserName(false)
                    }
                }
            }
        checkusernameUnique()
    },[userName])

    async function onsubmit(data:z.infer<typeof signUpSchema>)
    {
        setIsSubmitting(true)
        try {
             console.log("data :",data)
            const response = await axios.post("/api/sign-up",data)
           
            router.replace(`/verify/${userName}`)
            setIsSubmitting(false)
        } catch (error) {
            console.log("error while submitting : ",error)
            setIsSubmitting(false)

        }
    }
    console.log("username msg",userNameMsg)
  return (
    <div className="flex justify-center items-center
    min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white
         rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold 
                 tracking-tight lg:text-5xl mb-6">
                    Join Mystery Message
                </h1>
                <p className="mb-4">
                    Sign up to start your anonymous adventure
                </p>
            </div>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="username.." {...field} 
                                onChange={(e)=>{
                                    field.onChange(e)
                                    debouncedUserName(e.target.value)
                                }}/>
                            </FormControl>
                            {
                                isCheckingUsername && <Loader2 className="animate-spin"/>
                                
                            }
                            {
                                <p className={`text-sm ${userNameMsg ==="username available"?'text-green-500':'text-red-500'}`}>
                                    {
                                        userNameMsg                                     
                                    }
                                </p>
                            }
                            <FormMessage />
                            </FormItem>  
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>email</FormLabel>
                            <FormControl>
                                <Input placeholder="email.." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="Password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>password </FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="password.." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting?(
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>please wait 
                                </>
                                ):("signUp")
                            }
                        </Button>
                </form>
            </FormProvider>
            <div className="text-center mt-4">
                <p>
                    Already a member?{" "}
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                    Sign in
                    </Link>
                </p>
            </div>
        </div>
    </div>
  )
}

export default SignUpPage