'use client'
import { useState } from 'react';
import { Search as Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ArrowRight } from 'lucide-react'
import useToggleState from '@/hooks/useToggleState';

export default function Search({ drugs }) {

    const { state, open, close } = useToggleState()

    const router = useRouter()

    const [query, setQuery] = useState('')

    const filteredProducts = drugs.filter(medicine =>
        medicine.drug_id.toLowerCase().includes(query.toLowerCase()) ||
        medicine.drug_name.toLowerCase().includes(query.toLowerCase()) ||
        medicine.provider.toLowerCase().includes(query.toLowerCase()) ||
        medicine.bin_number.toLowerCase().includes(query.toLowerCase()) ||
        medicine.batch_number.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className='max-w-xl w-full flex items-center justify-center'>

            <Dialog open={state} onOpenChange={(value) => value ? open() : close()}>
                <DialogContent className="p-0 bg-transparent border-none shadow-none top-[15%] max-w-4xl w-full mx-auto">
                    <div className='relative'>
                        <div className='bg-white shadow-lg p-2 rounded-lg'>

                            <div className='relative flex'>
                                <div className='absolute p-1 m-1 top-0 right-0'>
                                    <Icon className='opacity-40' />
                                </div>

                                <Input className="focus-visible:ring-none bg-[#E3EBF3] border-none placeholder:text-black/60 font-medium" placeholder="Search for medicine here..."
                                    type='text'
                                    onChange={(e) => setQuery(e.target.value)} />
                            </div>
                        </div>
                        <div className='absolute z-50 top-16 w-full max-h-[650px] overflow-visible grid grid-cols-2 gap-2'>
                            {filteredProducts.length > 0 ? filteredProducts.map((product) =>

                                <Button key={product.drug_id} className="justify-between h-full group text-left focus-visible:ring-none"
                                onClick={() => {
                                    close()
                                    router.replace(`/dashboard/inventory/list/${product.drug_id}`)
                                }}
                                    variant="outline"
                                >
                                    <div>
                                        <div className='font-semibold text-xl'>
                                            {product.drug_name}
                                        </div>
                                        <span className='italic'>{product.provider}</span>
                                    </div>

                                    <div className='text-2xl flex-1 text-right mr-4'>
                                        <span className='font-medium'>
                                            BIN
                                        </span>{" "}{product.bin_number}
                                    </div>
                                    <ArrowRight className="w-5 h-5 stroke-[1.5] -rotate-45 group-hover:rotate-0 group-hover:scale-105 ease-in-out duration-150" />
                                </Button>
                            ) :
                                <div className='col-span-2 w-full text-center mt-4 p-2 shadow-sm border rounded-md bg-white text-gray-700'>
                                    No Results Found
                                </div>
                            }
                        </div>
                    </div>

                </DialogContent>
            </Dialog>

            <div className="w-full">
                <div className='relative flex'>
                    <div className='absolute p-1 m-1 top-0 right-0'>
                        <Icon className='opacity-40' />
                    </div>
                    <Button className="bg-[#E3EBF3] border-none text-black/50 font-medium w-full justify-start hover:bg-[#E3EBF3]/70"
                        onClick={open}>
                        Search for medicine here...
                    </Button>
                </div>
            </div>
        </div>
    )
}
