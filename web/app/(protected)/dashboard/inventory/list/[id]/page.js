import { API } from '@/config/api'
import { ChevronRight, Pencil } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Status, StatusContent, StatusHeader, StatusItem, StatusItemLabel, StatusItemValue, StatusLabel, StatusLink } from "@/components/dashboard/Status";
import Link from 'next/link'
import { convertDateFormat } from '@/lib/utils';
import DeleteButton from '@/components/dashboard/DeleteButton';

export default async function Page({ params: { id } }) {
  const drug = await API.get(`drug/${id}`).catch((err) => null)

  if (!drug) redirect('/dashboard/inventory/list')

  return (
    <div className="pb-4 px-8">
      <div className='flex justify-between items-center'>
        <div>
          <div className='flex text-2xl font-bold items-center gap-2'>
            <Link href={'/dashboard/inventory'} className='text-gray-400'>Inventory{" "}</Link>
            <ChevronRight />
            <Link href={"/dashboard/inventory/list"} className="font-bold text-gray-400">List of Medicines</Link>
            <ChevronRight />
            <h2 className="font-bold text-2xl">{drug.drug_name}</h2>
          </div>
          <span>List of medicines available for sales.</span>
        </div>
        <Link href={`/dashboard/inventory/${drug.drug_id}/edit`} className='flex gap-2 items-center rounded-md text-white bg-blue-500 px-4 py-2 hover:bg-blue-500/80'>
          <Pencil className='w-4 h-4' />
          <span>Edit Details</span>
        </Link>
      </div>
      <div className='mt-8 grid flex-1 grid-cols-2 gap-6'>
        <Status>
          <StatusHeader>
            <StatusLabel className="px-2">
              Medicine
            </StatusLabel>
          </StatusHeader>
          <StatusContent className="p-6 grid-cols-3">
            <StatusItem>
              <StatusItemValue>
                {drug.drug_id}
              </StatusItemValue>
              <StatusItemLabel>
                Medicine ID
              </StatusItemLabel>
            </StatusItem>
            <StatusItem>
              <StatusItemValue>
                {drug.provider}
              </StatusItemValue>
              <StatusItemLabel>
                Medicine Provider
              </StatusItemLabel>
            </StatusItem>
            <StatusItem>
              <StatusItemValue>
                {drug.expiry_date}
              </StatusItemValue>
              <StatusItemLabel>
                Expiry Date
              </StatusItemLabel>
            </StatusItem>
          </StatusContent>
        </Status>

        <Status>
          <StatusHeader>
            <StatusLabel className="px-2">
              Inventory in Qty
            </StatusLabel>
          </StatusHeader>
          <StatusContent className="p-6 grid-cols-3">
            <StatusItem>
              <StatusItemValue>
                {drug.lifetime_supply}
              </StatusItemValue>
              <StatusItemLabel>
                Lifetime Supply
              </StatusItemLabel>
            </StatusItem>
            <StatusItem>
              <StatusItemValue>
                {drug.lifetime_sales}
              </StatusItemValue>
              <StatusItemLabel>
                Lifetime Sales
              </StatusItemLabel>
            </StatusItem>
            <StatusItem>
              <StatusItemValue>
                {drug.stock}
              </StatusItemValue>
              <StatusItemLabel>
                Stock Left
              </StatusItemLabel>
            </StatusItem>
          </StatusContent>
        </Status>

        <Status>
          <StatusHeader>
            <StatusLabel className="px-2">
              Others
            </StatusLabel>
          </StatusHeader>
          <StatusContent className="p-6">
            <StatusItem>
              <StatusItemValue>
                {drug.bin_number}
              </StatusItemValue>
              <StatusItemLabel>
                Bin Number
              </StatusItemLabel>
            </StatusItem>
            <StatusItem>
              <StatusItemValue>
                {drug.batch_number}
              </StatusItemValue>
              <StatusItemLabel>
                Batch Number
              </StatusItemLabel>
            </StatusItem>
          </StatusContent>
        </Status>
      </div>
      <div className='mt-4 flex flex-col gap-4'>
        <Status>
          <StatusHeader>
            <StatusLabel className="px-2">
              How to use
            </StatusLabel>
          </StatusHeader>
          <StatusContent className="p-6 flex">
            {drug.usage}
          </StatusContent>
        </Status>
        <Status>
          <StatusHeader>
            <StatusLabel className="px-2">
              Side Effects
            </StatusLabel>
          </StatusHeader>
          <StatusContent className="p-6 flex">
            {drug.side_effects}
          </StatusContent>
        </Status>
      </div>
      <DeleteButton medicine={drug} />
    </div>
  )
}
