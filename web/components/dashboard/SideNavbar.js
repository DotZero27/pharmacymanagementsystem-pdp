import { protectedRoute } from "@/lib/serverHelper"
import { HeartPulse } from 'lucide-react';
import UserActions from "./UserActions";


export default async function SideNavbar() {
  const user = await protectedRoute()

  return (
    <nav className="flex-1 flex-col justify-between flex bg-gray-800 max-w-[200px]">
      <div className="flex gap-4 justify-start items-center p-3 font-semibold text-lg bg-gray-900 text-white">
        <HeartPulse className="w-5 h-5" /> Pharmacy
      </div>
      <UserActions user={user}/>
    </nav>
  )
}
