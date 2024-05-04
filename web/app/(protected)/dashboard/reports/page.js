import Link from 'next/link'
import { ChevronRight, ShieldPlus, IndianRupee } from 'lucide-react';
import { getCurrentMonthStartAndEnd } from '@/lib/utils';
import { API } from '@/config/api';
import { format } from 'date-fns';

export default async function Page() {
  const { start, end } = getCurrentMonthStartAndEnd()

  const revenue = (await API.get(`get_report/${start}/${end}`).catch(() => 0)).grand_total || 0

  return (
    <div className="px-8 ">
      <div className='flex justify-between items-center'>
        <div>
          <div className='flex text-2xl font-bold items-center gap-2'>
            <Link href={'/dashboard/reports'}>Reports{" "}</Link>
          </div>
          <span>Overall reports related to the pharmacy.</span>
        </div>
      </div>
      <div className="my-6 mb-12 grid grid-cols-4 gap-x-12 ">

        <div className="border-2 rounded-md border-yellow-500" >
          <div className="flex flex-col items-center justify-center text-center py-10 gap-2 bg-white rounded-md">
            <div>
              <IndianRupee className="stroke-yellow-600 w-12 h-12" />
            </div>
            <span className="font-bold text-2xl">Rs.{revenue || 0}</span>
            <div className="text-lg">
              Revenue:{" "}{format(new Date(), "MMM y")}
            </div>
          </div>
          <Link href={'/dashboard/reports/sales'} className="flex gap-1 py-1 text-sm items-center justify-center bg-yellow-300/60 border-t-2 border-yellow-500 w-full">
            View Detailed Report{" "}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}
