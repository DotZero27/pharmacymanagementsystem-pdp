import Link from 'next/link'
import { ChevronRight, ShieldPlus, AlertTriangle, Cross, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

export default function QuickLook({revenue,availableMedicines,shortage}) {
  return (
    // Status Cards
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-12 my-6 mb-12">
      <div className="border-2 rounded-md border-green-500" >
        <div className="flex flex-col items-center justify-center text-center py-10 gap-2 bg-white rounded-md">
          <div>
            <ShieldPlus className="stroke-green-600 w-12 h-12" />
          </div>
          <span className="font-bold text-2xl">Good</span>
          <div className="text-lg">
            Inventory Status
          </div>
        </div>
        <Link href={"#"} className="flex gap-1 py-1 text-sm items-center justify-center bg-green-300/60 border-t-2 border-green-500 w-full">
          View Detailed Report{" "}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="border-2 rounded-md border-yellow-500" >
        <div className="flex flex-col items-center justify-center text-center py-10 gap-2 bg-white rounded-md">
          <div>
            <IndianRupee className="stroke-yellow-600 w-12 h-12" />
          </div>
          <span className="font-bold text-2xl">Rs.{revenue}</span>
          <div className="text-lg">
            Revenue:{" "}{format(new Date(), "MMM y")}
          </div>
        </div>
        <Link href={"#"} className="flex gap-1 py-1 text-sm items-center justify-center bg-yellow-300/60 border-t-2 border-yellow-500 w-full">
          View Detailed Report{" "}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="border-2 rounded-md border-blue-500">
        <div className="flex flex-col items-center justify-center text-center py-10 gap-2 bg-white rounded-md">
          <div>
            <Cross className="stroke-blue-600 w-12 h-12" />
          </div>
          <span className="font-bold text-2xl">{availableMedicines}</span>
          <div className="text-lg">
            Medicines Available
          </div>
        </div>
        <Link href={"/dashboard/inventory"} className="flex gap-1 py-1 text-sm items-center justify-center bg-blue-300/60 border-t-2 border-blue-500 w-full">
          Visit Inventory{" "}
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
    </div>
  )
}
