import BillGenerateForm from '@/components/dashboard/BillGenerateForm'
import { API } from '@/config/api'
import { drugInventorySorted } from '@/lib/utils'
import Link from 'next/link'

export default async function Page() {
    const allDrugs = (await API.get('get_drugs').catch(() => [])).drugs

    const {drugs,provider} = drugInventorySorted(Object.entries(allDrugs),false)

    return (
        <div className="px-8">
            <BillGenerateForm drugs={drugs}/>
        </div>
    )
}
