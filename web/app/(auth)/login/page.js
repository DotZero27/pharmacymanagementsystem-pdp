import Login from "@/components/Login";
import { auth } from "@/config/auth";
import { redirect } from 'next/navigation'
import Image from 'next/image'
import AbstractBG from '@/assets/abstractbg.webp'

export default async function Page() {
  const user = await auth()

  if (user) redirect('/dashboard')

  return (
    <div className="flex flex-col flex-1 py-8">
        <p className="text-3xl my-4 font-semibold">Pharmacy Login</p>
        <Login />
    </div>
  )
}
