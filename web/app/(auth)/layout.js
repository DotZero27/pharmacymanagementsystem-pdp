import React from 'react'

export default function AuthLayout({children}) {
  return (
    <main className='max-w-sm w-full mx-auto flex flex-col flex-1 mt-12'>
        {children}
    </main>
  )
}
