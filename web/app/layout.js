import './globals.css'
import { Poppins } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import Providers from '@/context/Providers';

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap'
})

export const metadata = {
  title: 'Pharmacy',
  description: 'Pharmacy Management Application',
}

export const revalidate = 0

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} flex flex-col h-screen bg-gray-300/90 text-[#1D242E]`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
