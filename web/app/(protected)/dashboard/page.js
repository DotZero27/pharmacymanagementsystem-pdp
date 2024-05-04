
import { protectedRoute } from "@/lib/serverHelper"

import QuickLook from "@/components/dashboard/QuickLook";
import { Status, StatusContent, StatusHeader, StatusItem, StatusItemLabel, StatusItemValue, StatusLabel, StatusLink } from "@/components/dashboard/Status";
import { DASHBOARD_ROUTES } from "@/config/data";
import {  drugInventorySorted, getCurrentMonthStartAndEnd } from "@/lib/utils";
import { API } from "@/config/api";
import { format } from "date-fns";

export default async function Page() {
  await protectedRoute()

  const { start, end } = getCurrentMonthStartAndEnd()

  const report = await API.get(`get_report/${start}/${end}`).catch(()=>0)

  const allDrugs = (await API.get('get_drugs').catch(() => [])).drugs

  const {drugs,provider} = drugInventorySorted(Object.entries(allDrugs))

  const shortage = await API.get('get_low_stock_drugs').then((res) =>Object.values(res?.drugs).length).catch(()=>0)

  const totalCustomers = (await API.get('get_all_customers'))?.customers?.length || 0
  const totalUsers = (await API.get('get_all_users'))?.users?.length || 0
  const totalProviders = (await API.get('get_all_providers'))?.providers?.length || 0

  return (
    <>
      <div className="px-8">
        <div>
          <h2 className="font-bold text-2xl">{DASHBOARD_ROUTES["dashboard"].label}</h2>
          <span>{DASHBOARD_ROUTES["dashboard"].description}</span>
        </div>
        <QuickLook revenue={report?.grand_total || 0} availableMedicines={drugs.length} shortage={shortage} />
      </div>

      {/* Main */}
      <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 bg-white p-8 gap-6">

        <Status>
          <StatusHeader>
            <StatusLabel>Inventory</StatusLabel>
            <StatusLink href="/dashboard/inventory">
              Go to Configuration
            </StatusLink>
          </StatusHeader>
          <StatusContent>
            <StatusItem>
              <StatusItemValue>
                {drugs.length}
              </StatusItemValue>
              <StatusItemLabel>
                Total No of Medicines
              </StatusItemLabel>
            </StatusItem>

            <StatusItem>
              <StatusItemValue>
                {totalProviders}
              </StatusItemValue>
              <StatusItemLabel>
                Medicine Provider
              </StatusItemLabel>
            </StatusItem>

          </StatusContent>
        </Status>

        <Status>
          <StatusHeader>
            <StatusLabel>Quick Report</StatusLabel>
            <StatusLink href="/dashboard/reports/sales">
             {format(new Date(),'MMM yy')}
            </StatusLink>
          </StatusHeader>
          <StatusContent>
            <StatusItem>
              <StatusItemValue>
               {report?.total_quantity}
              </StatusItemValue>
              <StatusItemLabel>
                Qty of Medicines Sold
              </StatusItemLabel>
            </StatusItem>

            <StatusItem>
              <StatusItemValue>
              {report?.total_bills}
              </StatusItemValue>
              <StatusItemLabel>
                Invoices Generated
              </StatusItemLabel>
            </StatusItem>

          </StatusContent>
        </Status>

        <Status>
          <StatusHeader>
            <StatusLabel>My Pharmacy</StatusLabel>
            {/* <StatusLink href="#">
              Go to User Management
            </StatusLink> */}
          </StatusHeader>
          <StatusContent>
            <StatusItem>
              <StatusItemValue>
                {totalUsers}
              </StatusItemValue>
              <StatusItemLabel>
                Total no of Users
              </StatusItemLabel>
            </StatusItem>

          </StatusContent>
        </Status>

        <Status>
          <StatusHeader>
            <StatusLabel>Customers</StatusLabel>
            <StatusLink href="#">
              Go to Customers Page
            </StatusLink>
          </StatusHeader>
          <StatusContent>
            <StatusItem>
              <StatusItemValue>
                {totalCustomers}
              </StatusItemValue>
              <StatusItemLabel>
                Total No of Customers
              </StatusItemLabel>
            </StatusItem>
            <StatusItem>
              <StatusItemValue>
                {report.most_frequent_item}
              </StatusItemValue>
              <StatusItemLabel>
                Frequently bought item
              </StatusItemLabel>
            </StatusItem>

          </StatusContent>
        </Status>

      </div>
    </>
  )
}
