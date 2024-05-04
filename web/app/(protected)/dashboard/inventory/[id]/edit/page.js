import MedicineForm from "@/components/MedicineForm";
import { API } from "@/config/api";
import {redirect} from 'next/navigation'

export default async function EditPage({ params: { id }}) {
  const drug = await API.get(`drug/${id}`).catch((err) => null)

  if (!drug) redirect('/dashboard/inventory/list')

  return (
    <MedicineForm drug={drug}/>
  )
}
