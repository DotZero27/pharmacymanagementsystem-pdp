import 'server-only'

import { auth } from "@/config/auth";
import { redirect } from 'next/navigation'

export async function protectedRoute() {
    const session = await auth()
    if (!session) redirect('/login')
    return session
  }
  