import Clock from "../Clock";
import Search from "./Search";
import { API } from '@/config/api'
import { drugInventorySorted } from '@/lib/utils'

export default async function TopNavbar() {
    const allDrugs = (await API.get('get_drugs').catch(() => [])).drugs

    const {drugs} = drugInventorySorted(Object.entries(allDrugs),false)

    return (
        <div className="flex justify-between px-8 py-3 bg-[#F7FAFD] shadow-sm border-b">
            <Search drugs={drugs}/>
            <Clock/>
        </div>
    )
}
