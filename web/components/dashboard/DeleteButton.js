'use client'
import { API } from "@/config/api"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Trash } from 'lucide-react'
import useToggleState from "@/hooks/useToggleState"
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogHeader, DialogFooter } from "../ui/dialog"

export default function DeleteButton({ medicine }) {
    const router = useRouter()

    const { state, open, close } = useToggleState()

    const deleteItem = async () => {
        await API.post('remove_from_stock', medicine)
            .then(() => router.refresh())
            .catch((err) => console.log(err))
    }

    return (
        <>
            <Dialog open={state} onOpenChange={(value) => value ? open() : close()}>
                <DialogContent className="p-0 border-2 shadow-none">
                    <DialogHeader>
                        <DialogTitle className="border-b-2 p-4">Are you sure absolutely sure?</DialogTitle>
                        <DialogDescription className="px-4 py-2">
                            This action cannot be undone. Are you sure you want to permanently
                            delete this drug from our store?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='p-4'>
                        <Button onClick={close} variant="destructive">Cancel</Button>
                        <Button onClick={deleteItem}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Button className="gap-4 mt-8 pt-2 bg-white border border-red-500 text-red-500 hover:text-white" variant="destructive" onClick={open}>
                <Trash className='w-4 h-4' />
                Delete Medicine
            </Button>
        </>

    )
}
