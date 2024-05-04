import { useContext } from "react"
import { BillContext } from "@/context/BillProvider"

export const useBill = () => {
    const context = useContext(BillContext)
    if (context === null) {
        throw new Error("useBill must be used within a BillProvider")
    }
    return context
}