'use client'
import { useEffect } from "react"
import { Frown } from 'lucide-react';
import Link from 'next/link'

export default function Error({ error, reset }) {

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="h-screen w-full border-b relative bg-[#f9fafb]">
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center sm:p-32 gap-2">
                <div className="flex flex-col gap-4 items-center font-bold text-4xl text-center">
                    <Frown className="w-20 h-20" />
                    <p>something went wrong</p>
                </div>
                <div className="text-sm">Take a <Link className="text-xs font-mono underline" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">break</Link>
                    {" "}while we fix this
                </div>
            </div>
        </div>
    )
}
