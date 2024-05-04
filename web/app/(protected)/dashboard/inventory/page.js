import { API } from "@/config/api";
import Link from 'next/link'
import { ChevronRight, AlertTriangle, Cross, ShieldPlus, Plus } from 'lucide-react';
import { drugInventorySorted } from "@/lib/utils";

export default async function InventoryPage() {
  const allDrugs = (await API.get('get_drugs').catch(() => [])).drugs

  const { drugs, provider } = drugInventorySorted(Object.entries(allDrugs))

  const shortage = await API.get('get_low_stock_drugs').then((res) => Object.values(res?.drugs).length).catch(() => 0)

  return (
    <div className="px-8 ">
      <div className='flex justify-between items-center'>
        <div>
          <div className='flex text-2xl font-bold items-center gap-2'>
            <Link href={'/dashboard/inventory'}>Inventory{" "}</Link>
          </div>
          <span>List of medicines available for sales.</span>
        </div>
        <Link href={`/dashboard/inventory/new`} className='flex gap-2 items-center rounded-md text-white bg-blue-500 px-4 py-2 hover:bg-blue-500/80'>
          <Plus className='w-4 h-4' />
          <span>Add New Item</span>
        </Link>
      </div>

      <div className="my-6 mb-12 grid grid-cols-4 gap-x-12 ">
        <div className="border-2 rounded-md border-blue-500">
          <div className="flex flex-col items-center justify-center text-center py-10 gap-2 bg-white rounded-md">
            <div>
              <Cross className="stroke-blue-600 w-12 h-12" />
            </div>
            <span className="font-bold text-2xl">{drugs.length || 0}</span>
            <div className="text-lg">
              Medicines Available
            </div>
          </div>
          <Link href={'/dashboard/inventory/list'} className="flex gap-1 py-1 text-sm items-center justify-center bg-blue-300/60 border-t-2 border-blue-500 w-full">
            Visit Full List{" "}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="border-2 rounded-md border-red-500">
          <div className="flex flex-col items-center justify-center text-center py-10 gap-2 bg-white rounded-md">
            <div>
              <AlertTriangle className="stroke-red-600 w-12 h-12" />
            </div>
            <span className="font-bold text-2xl">{shortage > 0 ? shortage.toString().padStart(2, '0') : 0}</span>
            <div className="text-lg">
              Medicine Shortage
            </div>
          </div>
          <Link href={"/dashboard/inventory/shortage"} className="flex gap-1 py-1 text-sm items-center justify-center bg-red-300/60 border-t-2 border-red-500 w-full">
            Resolve Now{" "}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="border-2 rounded-md border-green-500">
          <div className="flex h-full flex-col items-center justify-center text-center py-10 gap-2 bg-white rounded-md">
            <div>
              <ShieldPlus className="stroke-green-600 w-12 h-12" />
            </div>
            <span className="font-bold text-2xl">{provider.length || 0}</span>
            <div className="text-lg">
              Medicine Providers
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
