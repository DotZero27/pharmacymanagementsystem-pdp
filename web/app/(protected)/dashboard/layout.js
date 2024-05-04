import SideNavbar from '@/components/dashboard/SideNavbar'
import TopNavbar from '@/components/dashboard/TopNavbar'
import { protectedRoute } from '@/lib/serverHelper'

export default async function DashboardLayout({ children }) {
  await protectedRoute()

  return (
    <main className='flex flex-1 justify-center'>
      <SideNavbar />
      <div className='flex flex-col flex-1'>
        <TopNavbar />
        <section className='flex flex-col flex-1 pt-7 bg-[#EDF1F5]'>
          {children}
        </section>
      </div>
    </main>
  )
}
