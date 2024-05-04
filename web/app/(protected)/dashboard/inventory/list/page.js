import { API } from "@/config/api"
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default async function Page({ searchParams: { expired, expiring } }) {
  const { drugs } = await API.get('get_drugs')

  const expiredDrugs = (await API.get('get_expired_drugs')).drugs

  const expiringDrugs = (await API.get('get_expiring_drugs')).drugs

  if (!drugs || !expiredDrugs || !expiringDrugs) return null

  const drugInventory = Object.entries(drugs).map(([drug_id, details]) => ({
    drug_id,
    ...details,
  }));

  if (expired) {
    return (
      <div className="px-8">
        <div>
          <div className='flex text-2xl font-bold items-center gap-2'>
            <Link href={'/dashboard/inventory'} className='text-gray-400'>Inventory{" "}</Link>
            <ChevronRight />
            <h2 className="font-bold text-2xl">List of Medicines</h2>
          </div>
          <span>List of medicines available for sales.</span>
        </div>
        <div className="mt-8 relative overflow-x-auto border-2 border-gray-400/40 rounded-md">
          <table className="w-full text-left rtl:text-right text-gray-500">
            <thead className="text-gray-700 capitalize bg-white border-b-2 border-gray-400/40">
              <tr>
                <th scope="col" className="px-6 py-3">Medicine name</th>
                <th scope="col" className="px-6 py-3">Medicine Id</th>
                <th scope="col" className="px-6 py-3">Provider</th>
                <th scope="col" className="px-6 py-3">Days after Expiry</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(expiredDrugs).map(([id, drug]) => <tr key={drug.drug_id} className="bg-white border-b border-gray-400/40 font-normal text-black">
                <td
                  scope="row"
                  className="px-6 py-4 max-w-[250px] text-ellipsis overflow-hidden  whitespace-nowrap"
                >
                  {drug.drug_name}
                </td>
                <td className="px-6 py-4">{id}</td>
                <td className="px-6 py-4">{drug.provider}</td>
                <td className="px-6 py-4">{drug.days_after_expiry}</td>
                <td className="px-6 py-4">
                  <Link href={`/dashboard/inventory/list/${drug.drug_id}`} className="flex items-center gap-1 group">
                    View Full Detail{" "}<ArrowRight className="w-5 h-5 stroke-[1.5] -rotate-45 group-hover:rotate-0 group-hover:scale-105 ease-in-out duration-150" />
                  </Link>
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (expiring) {
    return (
      <div className="px-8">
        <div>
          <div className='flex text-2xl font-bold items-center gap-2'>
            <Link href={'/dashboard/inventory'} className='text-gray-400'>Inventory{" "}</Link>
            <ChevronRight />
            <h2 className="font-bold text-2xl">List of Medicines</h2>
          </div>
          <span>List of medicines available for sales.</span>
        </div>
        <div className="mt-8 relative overflow-x-auto border-2 border-gray-400/40 rounded-md">
          <table className="w-full text-left rtl:text-right text-gray-500">
            <thead className="text-gray-700 capitalize bg-white border-b-2 border-gray-400/40">
              <tr>
                <th scope="col" className="px-6 py-3">Medicine name</th>
                <th scope="col" className="px-6 py-3">Medicine Id</th>
                <th scope="col" className="px-6 py-3">Provider</th>
                <th scope="col" className="px-6 py-3">Days until Expiry</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(expiringDrugs).map(([id, drug]) => <tr key={id} className="bg-white border-b border-gray-400/40 font-normal text-black">
                <td
                  scope="row"
                  className="px-6 py-4 max-w-[250px] text-ellipsis overflow-hidden  whitespace-nowrap"
                >
                  {drug.drug_name}
                </td>
                <td className="px-6 py-4">{id}</td>
                <td className="px-6 py-4">{drug.provider}</td>
                <td className="px-6 py-4">{drug.days_until_expiry}</td>
                <td className="px-6 py-4">
                  <Link href={`/dashboard/inventory/list/${drug.drug_id}`} className="flex items-center gap-1 group">
                    View Full Detail{" "}<ArrowRight className="w-5 h-5 stroke-[1.5] -rotate-45 group-hover:rotate-0 group-hover:scale-105 ease-in-out duration-150" />
                  </Link>
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="px-8">
      <div>
        <div className='flex text-2xl font-bold items-center gap-2'>
          <Link href={'/dashboard/inventory'} className='text-gray-400'>Inventory{" "}</Link>
          <ChevronRight />
          <h2 className="font-bold text-2xl">List of Medicines</h2>
        </div>
        <span>List of medicines available for sales.</span>
      </div>
      <div className="mt-8 relative overflow-x-auto border-2 border-gray-400/40 rounded-md">
        <table className="w-full text-left rtl:text-right text-gray-500">
          <thead className="text-gray-700 capitalize bg-white border-b-2 border-gray-400/40">
            <tr>
              <th scope="col" className="px-6 py-3">Medicine name</th>
              <th scope="col" className="px-6 py-3">Medicine Id</th>
              <th scope="col" className="px-6 py-3">Provider</th>
              <th scope="col" className="px-6 py-3">Stock in Qty</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              drugInventory.map((drug, i) => {
                return (
                  <tr key={drug.drug_id} className="bg-white border-b border-gray-400/40 font-normal text-black">
                    <td
                      scope="row"
                      className="px-6 py-4 max-w-[250px] text-ellipsis overflow-hidden  whitespace-nowrap"
                    >
                      {drug.drug_name}
                    </td>
                    <td className="px-6 py-4">{drug.drug_id}</td>
                    <td className="px-6 py-4">{drug.provider}</td>
                    <td className="px-6 py-4">{drug.stock}</td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/inventory/list/${drug.drug_id}`} className="flex items-center gap-1 group">
                        View Full Detail{" "}<ArrowRight className="w-5 h-5 stroke-[1.5] -rotate-45 group-hover:rotate-0 group-hover:scale-105 ease-in-out duration-150" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
