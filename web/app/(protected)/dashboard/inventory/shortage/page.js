import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { API } from '@/config/api'
import { ArrowRight,Laugh } from 'lucide-react'

export default async function Page() {
    const shortage = (await API.get('get_low_stock_drugs')).drugs
    return (
        <div className="px-8">
            <div>
                <div className='flex text-2xl font-bold items-center gap-2'>
                    <Link href={'/dashboard/inventory'} className='text-gray-400'>Inventory{" "}</Link>
                    <ChevronRight />
                    <h2 className="font-bold text-2xl">Low Stock Medicines</h2>
                </div>
                <span>List of medicines low stock.</span>
            </div>
            {Object.keys(shortage).length === 0 ?
                <div className='flex gap-2 items-center mt-16'>
                    <p className='text-4xl font-semibold'>
                    Everything seems to be good!
                    </p>
                    <Laugh className='w-10 h-10'/>
                </div>
                :
                <div className="mt-8 relative overflow-x-auto border-2 border-gray-400/40 rounded-md">
                    <table className="w-full text-left rtl:text-right text-gray-500">
                        <thead className="text-gray-700 capitalize bg-white border-b-2 border-gray-400/40">
                            <tr>
                                <th scope="col" className="px-6 py-3">Medicine name</th>
                                <th scope="col" className="px-6 py-3">Expiry Date</th>
                                <th scope="col" className="px-6 py-3">Provider</th>
                                <th scope="col" className="px-6 py-3">Stock in Qty</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.entries(shortage).map(([id, drug]) => {
                                    return (
                                        <tr key={id} className="bg-white border-b border-gray-400/40 font-normal text-black">
                                            <td
                                                scope="row"
                                                className="px-6 py-4 max-w-[250px] text-ellipsis overflow-hidden  whitespace-nowrap"
                                            >
                                                {drug.drug_name}
                                            </td>
                                            <td className="px-6 py-4">{drug.expiry_date}</td>
                                            <td className="px-6 py-4">{drug.provider}</td>
                                            <td className="px-6 py-4 text-red-600">{drug.stock}</td>
                                            <td className="px-6 py-4">
                                                <Link href={`/dashboard/inventory/list/${id}`} className="flex items-center gap-1 group">
                                                    View Full Detail{" "}<ArrowRight className="w-5 h-5 stroke-[1.5] -rotate-45 group-hover:rotate-0 group-hover:scale-105 ease-in-out duration-150" />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            }

        </div>
    )
}
