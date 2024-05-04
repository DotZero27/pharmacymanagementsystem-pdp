import { LayoutDashboard, Pill, Activity,Receipt } from 'lucide-react'

export const DASHBOARD_ROUTES = {
    dashboard: {
        label: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
        description: 'A quick data overview of the inventory.'
    },
    inventory: {
        label: 'Inventory',
        url: '/dashboard/inventory',
        icon: Pill,
        description: 'List of medicines available for sales.',
        subcategories: [
            {
                label: 'List of medicines',
                url: '/dashboard/inventory/list',
            },
            {
                label: 'Shortage',
                url: '/dashboard/inventory/shortage',
            }
        ]
    },
    reports: {
        label: 'Reports',
        url: '/dashboard/reports',
        icon: Activity,
        description: 'Overall reports related to the pharmacy.',
        subcategories: [
            {
                label:'Sales Report',
                description: 'Sales related report of the pharmacy.',
                url: '/dashboard/reports/sales',
            }
        ]
    },
    bill:{
        label: 'Bill',
        url: '/dashboard/bill',
        icon: Receipt,
        
    }
}