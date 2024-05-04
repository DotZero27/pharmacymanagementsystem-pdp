'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema } from '@/validations/auth'
import { useRouter } from "next/navigation";
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import { signIn } from 'next-auth/react';
import axios from 'axios';
import Loading from './Loading';
import { API } from '@/config/api';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)

    const Show = showPassword ? EyeOff : Eye

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: 'Lohit',
            email: 'lohitvignesh2002@gmail.com',
            password: 'Lohit123*',
            confirmPassword: 'Lohit123*',
        }
    });

    const router = useRouter()

    const { mutate: registerUser, isPending } = useMutation({
        mutationFn: async (data) => {
            const request = await API.post('create_user', data)

            if (request) {
                toast({
                    description: 'Account Created!',
                })
                await signIn('credentials', {
                    username: data.username,
                    password: data.password,
                    callbackUrl: '/dashboard',
                    redirect: true,
                });
            }
        },
        onError: (err) => {
            form.reset()
            console.log(err)

            if (err.message) {
                return toast({
                    description: err?.message || 'Try again later!',
                    variant: 'destructive',
                })
            }

            switch (err.status) {
                case 401:
                    return toast({
                        title: 'Invalid credentials',
                        description: 'Credentials do not match',
                        variant: 'destructive',
                    })
                case 403:
                    return toast({
                        title: 'Oops! No permission',
                        description: 'You do not have the required permission for this action',
                        variant: 'destructive',
                    })
                default:
                    return toast({
                        title: 'Something went wrong.',
                        description: 'Please try again later',
                        variant: 'destructive',
                    })

            }

        },
        onSuccess: () => {
            return router.refresh()
        },
    })

    const onSubmit = async (data) => {
        registerUser(data)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full flex flex-col gap-y-2'>
                <p className='my-2 font-semibold text-3xl'>User Register</p>
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Email" type="email" {...field} />
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
                            <div className='relative flex'>
                                <div className='absolute p-1 rounded-md m-1 top-0 right-0'>
                                    <Show className={cn('opacity-20 stroke-[1.4px]', { "opacity-100": showPassword })} onClick={() => setShowPassword(!showPassword)} />
                                </div>

                                <FormControl>
                                    <Input placeholder="Password" type={showPassword ? 'text' : 'password'}  {...field} />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Confirm Password" type={showPassword ? 'text' : 'password'}  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className=" mt-6 py-6" disabled={isPending}>{isPending ? <Loading className="w-4 h-4" /> : "Create Account"}</Button>
            </form>
        </Form>
    )
}