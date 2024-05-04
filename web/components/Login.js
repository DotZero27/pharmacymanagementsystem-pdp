'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import loginSchema from '@/lib/login'
import { useRouter } from "next/navigation";
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from "next/link";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import { signIn } from "next-auth/react";

export default function Login() {
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: 'Lohit',
            password: 'Lohit123*',
        }
    });

    const router = useRouter()

    const { mutate: loginUser, isPending } = useMutation({
        mutationFn: async ({ username, password }) => {
            const { error } = await signIn('credentials', {
                username,
                password,
                callbackUrl: '/dashboard',
                redirect: false,
            })

            if (error) throw error
        },
        onError: (err) => {
            if (err) {
                form.reset()
                console.log(err)

                switch (err.message) {
                    case 'Invalid login credentials':
                        return toast({
                            title: 'Something went wrong.',
                            description: 'Invalid login credentials',
                            variant: 'destructive',
                        })
                    default:
                        return toast({
                            title: 'Something went wrong.',
                            description: 'Please try again later',
                            variant: 'destructive',
                        })
                }
            }
        },
        onSuccess: () => {
            toast({
                description: 'You have successfully logged in!',
            })

            return router.refresh()
        },
    })

    const onSubmit = async (data) => {
        loginUser(data)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full flex flex-col gap-4'>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
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
                            <FormControl>
                                <Input placeholder="Password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Sign in</Button>
                <div className='flex gap-1 text-sm'>
                    <span>
                        {"Don't have an account?"}
                    </span>
                    <Link href='/register' className='underline'>Register here</Link>
                </div>
            </form>
        </Form>
    )
}
