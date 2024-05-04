import { API } from "@/config/api";
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ReportChart from "@/components/report/ReportChart";
import { Status, StatusContent, StatusHeader, StatusLabel } from "@/components/dashboard/Status";
import { format, parse } from "date-fns";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { redirect } from 'next/navigation'

async function getWeeklyReport(startDate, endDate) {

    // Format the dates to YYYY-MM-DD
    const formatDate = (date) => new Date(date).toISOString().split('T')[0];

    // Use the formatted dates in the API call
    const apiEndpoint = `get_report/${formatDate(startDate)}/${formatDate(endDate)}`;
    const weeklyReport = (await API.get(apiEndpoint)).purchases;

    if (Object.keys(weeklyReport).length === 0) {
        return null;
    }

    return weeklyReport;
}

const processChartData = (purchasesByDate) => {
    const chartLabels = Object.keys(purchasesByDate)
    const chartData = chartLabels.map(date => {
        // Summing up the total amount payable for each date
        return purchasesByDate[date].reduce((total, purchase) => {
            return total + purchase.totalamountpayable;
        }, 0);
    });

    return {
        labels: chartLabels,
        datasets: [
            {
                label: 'Total Sales',
                data: chartData,
                tension: 0.35,
            },
        ],
    };
};

const processReportData = (reportData) => {
    if(!reportData) return null

    let aggregatedData = [];

    Object.keys(reportData).forEach(date => {
        const dailyReports = reportData[date];
        aggregatedData = [...aggregatedData, ...dailyReports];
    });

    return aggregatedData;
};


export default async function Page({ searchParams: { startDate, endDate } }) {

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    if (startDate && !endDate || !startDate && endDate) redirect('/dashboard/reports/sales')


    if (!startDate || !endDate) {
        start.setDate(end.getDate() - 7);
    }

    const weeklyReport = await getWeeklyReport(start, end)

    const report = weeklyReport && processChartData(weeklyReport)

    const aggregatedData = processReportData(weeklyReport) || [];

    return (
        <div className="px-8 ">
            <div>
                <div className='flex text-2xl font-bold items-center gap-2'>
                    <Link href={'/dashboard/reports'} className='text-gray-400'>Reports{" "}</Link>
                    <ChevronRight />
                    <h2 className="font-bold text-2xl">Sales Report</h2>
                </div>
                <span>Sales related report of the pharmacy.</span>
            </div>
            <div className="mt-4">
                <p>
                    Date Range
                </p>
                <DatePickerWithRange startDate={start} endDate={end} />
            </div>
            {weeklyReport ?
                <div className="mt-6 flex flex-col lg:flex-row gap-12">

                    <Status className="max-w-5xl w-full">
                        <StatusHeader>
                            <StatusLabel className="px-3">Sales Made</StatusLabel>
                        </StatusHeader>
                        <StatusContent className="p-6 grid-cols-1">
                            <ReportChart report={report} />
                        </StatusContent>
                    </Status>

                    <Status className="lg:max-w-md w-full ">
                        <StatusHeader>
                            <StatusLabel className='flex items-center justify-between w-full'>
                                <p className="w-full px-4">
                                    Bill ID
                                </p>
                                <p className="w-full px-4">
                                    Date & Time
                                </p>
                            </StatusLabel>
                        </StatusHeader>
                        <StatusContent className="flex flex-col gap-2 max-h-[400px] h-full overflow-auto">
                            {aggregatedData.map((bill) => {
                                const purchaseDateTime = `${bill.purchase_date} ${bill.purchase_time}`;
                                const parsedDate = parse(purchaseDateTime, 'yyyy/MM/dd hh:mm aa', new Date());
                                const formattedDateTime = format(parsedDate, 'd MMM yyyy h:mm');
                                return (
                                    <div className="flex flex-col gap-4" key={bill.id}>
                                        <div key={bill.id} className="flex px-4 py-2 border-b">
                                            <div className="w-full">
                                                <Link href={`/dashboard/reports/bills/${bill.id}`} className=" hover:underline">
                                                    {bill.id.padStart(8, '0')}
                                                </Link>
                                            </div>
                                            <div className="w-full">
                                                <div className="flex justify-evenly px-4">
                                                    {formattedDateTime.split(' ').map((dateFragment, i) =>
                                                        <span key={i}>
                                                            {dateFragment}
                                                        </span>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            )}
                        </StatusContent>
                    </Status>
                </div>
                : <div className="flex flex-1 items-center h-full justify-center text-2xl mt-6 font-medium">
                    No Sales recorded in this duration
                </div>}
        </div>
    )
}
