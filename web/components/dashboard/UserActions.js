'use client'

import Link from 'next/link'
import { cn } from "@/lib/utils";
import { User } from 'lucide-react'
import { usePathname } from 'next/navigation';
import { DASHBOARD_ROUTES } from '@/config/data';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '../ui/button';
import { signOut } from 'next-auth/react';

export default function UserActions({ user }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col flex-1 text-white">
            <div className="px-4 flex gap-4 items-center py-2 font-medium">
                <div className="border-2 p-2 border-gray-500 rounded-md">
                    <User />
                </div>
                <span>
                    {user.username}
                </span>
            </div>
            <ul className="flex flex-col flex-1 py-3">
                {Object.entries(DASHBOARD_ROUTES).map(([name, route], i) => {
                    const Icon = route.icon
                    const value = route?.subcategories?.find((route) => (route.url === pathname))

                    return (
                        route?.subcategories ? (
                            <Accordion key={i} collapsible defaultValue={value ? route.url : []}>
                                <AccordionItem value={route.url} className="border-none group">
                                    <Link href={route.url} shallow>
                                        <AccordionTrigger className={cn("flex w-full font-medium px-4 hover:no-underline", { "bg-teal-400/80": route.url === pathname, "bg-black": value?.url === pathname})}>
                                            <Icon className="w-5 h-5" />{" "}
                                            <span className='flex-1 text-left ml-5'>
                                            {route.label}
                                            </span>
                                        </AccordionTrigger>
                                    </Link>
                                    <AccordionContent forceMount={value?.url === pathname}>
                                        <ul>
                                            {route.subcategories.map((subcategory, i) => (
                                                <li key={i}>
                                                    <Link href={subcategory.url} className={cn("flex items-center font-medium gap-4 p-4 bg-black pl-10", { "bg-teal-400/80 group:bg-black": subcategory.url === pathname})}>
                                                        {subcategory.label}
                                                    </Link>
                                                </li>)
                                            )}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ) :
                            <li key={i}>
                                <Link href={route.url} className={cn("flex items-center font-medium gap-4 p-4 pl-4", { "bg-teal-400/80": route.url === pathname })}>
                                    <Icon className="w-5 h-5" />
                                    <span className='ml-1'>
                                        {route.label}
                                    </span>
                                </Link>
                            </li>

                    )
                })}
            </ul >


            <Button className="m-4 text-white" variant="link" onClick={signOut}>
                Logout
            </Button>
        </div >
    )
}
