import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Status = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div className={cn("border-2 border-black/30 rounded-md bg-white", className)} {...props} ref={ref}>
            {children}
        </div>)
})

Status.displayName = 'Status'

const StatusHeader = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div className={cn("border-b-2 border-black/30 p-4 flex justify-between items-center", className)} {...props} ref={ref}>
            {children}
        </div>
    )
})

StatusHeader.displayName = "StatusHeader"

const StatusLabel = React.forwardRef(({className, children, ...props }, ref) => {
    return (
        <span className={cn("font-semibold",className)} {...props} ref={ref}>
            {children}
        </span>
    )
})

StatusLabel.displayName = "StatusLabel"

const StatusLink = React.forwardRef(({classname, children, ...props }, ref) => {
    return (
        <Link className={cn("flex gap-1 py-1 text-sm items-center justify-center hover:underline",classname)} {...props} ref={ref}>
            {children}
            {" "}
            <ChevronRight className="w-4 h-4" />
        </Link>

    )
})

StatusLink.displayName = "StatusLink"

const StatusContent = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div className={cn("p-4 grid grid-cols-2 gap-4", className)} {...props} ref={ref}>
            {children}
        </div>
    )
})
StatusContent.displayName = "StatusContent"

const StatusItem = React.forwardRef(({ children, ...props }, ref) => {
    return (
        <div {...props} ref={ref}>
            {children}
        </div>
    )
})

StatusItem.displayName = "StatusItem"

const StatusItemLabel = React.forwardRef(({ children, ...props }, ref) => {
    return (
        <div className="font-medium text-sm" {...props} ref={ref}>
            {children}
        </div>
    )
})

StatusItemLabel.displayName = "StatusItemLabel"


const StatusItemValue = React.forwardRef(({ children, ...props }, ref) => {
    return (
        <span className="font-bold text-xl" {...props} ref={ref}>
            {children}
        </span>
    )
})

StatusItemValue.displayName = "StatusItemValue"

export {
    Status,
    StatusHeader,
    StatusLabel,
    StatusLink,
    StatusContent,
    StatusItem,
    StatusItemLabel,
    StatusItemValue
}


