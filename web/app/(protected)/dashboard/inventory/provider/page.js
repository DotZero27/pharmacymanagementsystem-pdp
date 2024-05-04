import { ChevronRight } from 'lucide-react'

export default function Page() {
  return (
    <div className="px-8">
      <div>
        <div className='flex text-2xl font-bold items-center gap-2'>
          <div className='text-gray-400'>Inventory{" "}</div>
          <ChevronRight />
          <h2 className="font-bold text-2xl">Medicines Provider</h2>
        </div>
        <span>List of medicines available for sales.</span>
      </div>
    </div>
  )
}
