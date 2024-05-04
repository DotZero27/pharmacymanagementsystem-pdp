'use client'
import { ChevronRight, CalendarIcon, Trash } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"

import { medicineSchema } from '@/validations/medicine';
import { Input } from './ui/input';
import { cn, convertDateFormat } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { API } from '@/config/api';
import { Separator } from './ui/separator';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function MedicineForm({ drug }) {
    const editMode = drug || false
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(medicineSchema),
        defaultValues: {
            drug_id: drug?.drug_id || '',
            drug_name: drug?.drug_name || '',
            price: drug?.price || '',
            stock: drug?.stock || '',
            expiry_date: convertDateFormat(drug?.expiry_date) || '',
            provider: drug?.provider || '',
            usage: drug?.usage || '',
            side_effects: drug?.side_effects || '',
            bin_number: drug?.bin_number || '',
            batch_number: drug?.batch_number || '',

        }
    });

    const { mutate: createOrUpdate, isPending } = useMutation({
        mutationFn: async (data) => {
            const { expiry_date: date, ...rest } = data

            const expiry_date = dateFormat(new Date(date))

            const body = {
                ...rest,
                expiry_date
            }
            return await API.post('add_to_stock', body)
        },
        onError: (err) => {
            console.log(err)

            return toast({
                title: 'Something went wrong.',
                description: 'Please try again later',
                variant: 'destructive',
            })
        },
        onSuccess: ({ id }) => {
            toast({
                description: editMode ? 'Saved' : 'New Medicine Added!',
            })

            return router.replace(`/dashboard/inventory/list/${id}`)
        },
    })


    const dateFormat = (input) => {
        const result = `${input.getMonth() + 1}/${input.getFullYear()}`
        return result
    }

    const onSubmit = async (data) => {
        createOrUpdate(data)
    }

    return (
        <div className="pb-4 px-8">
            <div className='flex justify-between items-center'>
                <div>
                    <div className='flex text-2xl font-bold items-center gap-2'>
                        <Link href={'/dashboard/inventory'} className='text-gray-400'>Inventory{" "}</Link>
                        <ChevronRight />
                        <Link href={"/dashboard/inventory/list"} className="font-bold text-gray-400">List of Medicines</Link>
                        <ChevronRight />
                        <h2 className="font-bold text-2xl">{drug?.drug_name || 'Add New Medicine'}</h2>
                    </div>
                    <span>*All fields are mandatory, except mentioned as (optional).</span>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 gap-4 mt-6'>
                        <FormField
                            control={form.control}
                            name="drug_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Medicine Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            // placeholder="How to use"
                                            type="text"
                                            className="h-14"

                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="drug_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Medicine ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            // placeholder="How to use"
                                            type="text"
                                            className="h-14"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            // placeholder="How to use"
                                            type="number"
                                            className="h-14"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expiry_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-end">
                                    <FormLabel>Expiry Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "text-left font-normal bg-[#E3EBF3] h-14 border border-black/30",
                                                        !field.value && "text-muted-foreground m-0"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "MMM y")
                                                    ) : (
                                                        <span>-Select Date-</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bin_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>BIN Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            // placeholder="How to use"
                                            type="text"
                                            className="h-14"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='grid col-span-2 grid-cols-2 xl:grid-cols-3 gap-4'>
                            <FormField
                                control={form.control}
                                name="provider"
                                render={({ field }) => (
                                    <FormItem className="col-span-2 xl:col-span-1">
                                        <FormLabel>Medicine Provider</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Provider"
                                                type="text"
                                                className="h-14"

                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity in Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                // placeholder="How to use"
                                                type="number"
                                                className="h-14"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="batch_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Batch Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                // placeholder="How to use"
                                                type="text"
                                                className="h-14"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator className="my-4 col-span-2" />

                        <FormField
                            control={form.control}
                            name="usage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>How to use</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="How to use"
                                            className="resize-none h-40"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="side_effects"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Side Effects</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            // placeholder="How to use"
                                            className="resize-none h-40"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button className={cn("gap-4 mt-8 pt",
                        { "bg-white border border-red-500 text-red-500 hover:text-white": editMode },
                    )}
                        variant="destructive"
                        size="lg"
                        disabled={isPending}
                    >
                        {editMode ? "Save" : "Save Details"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}