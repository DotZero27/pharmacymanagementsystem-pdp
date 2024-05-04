'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { BillProvider } from './BillProvider'

const queryClient = new QueryClient()

const Providers = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <BillProvider>
                {children}
            </BillProvider>
        </QueryClientProvider>
    )
}

export default Providers