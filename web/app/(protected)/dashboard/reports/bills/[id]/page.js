import Link from "next/link";
import { API } from "@/config/api";
import { redirect } from "next/navigation";
import { X } from "lucide-react";

export default async function Page({ params: { id } }) {
  const billData = await API.get(`get_bill/${id}`);

  if (!billData) redirect("/dashboard/reports");

  const bill = billData.bill;

  return (
    <div className="px-8 max-w-5xl w-full mx-auto">
      <h2 className="font-bold tracking-wider text-5xl">
        BILL
        <br />
        {id.padStart(8, "0")}
      </h2>
      <div className="grid grid-cols-2 gap-4 mt-10">
        <div className="flex flex-col justify-between bg-white rounded-lg">
          <h3 className="text-2xl font-medium mt-4 border-b py-4 px-6">
            Items Bought ({bill.totalquantity})
          </h3>
          <ul className="flex flex-col gap-2 flex-1 justify-start">
            {Object.entries(bill.meds).map(([id, med]) => (
              <li
                key={id}
                className="flex justify-between gap-4 px-6 py-2 w-full border-b"
              >
                <div>{med.drug_name}</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-xs">
                    {med.quantity} <X className="w-3 h-3" />{" "}
                    <span className="text-xs">
                      {med.amountpayable / med.quantity}
                    </span>
                  </div>
                  <div className="w-10">{med.amountpayable}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 items-end justify-end my-2 py-2 p-6 border-t">
            <div className="flex justify-between w-full">
              <div className="font-semibold">Total</div>
              <div className="w-10 font-semibold">
                {bill.totalamountpayable}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white flex flex-col gap-2 p-4 rounded-lg space-y-2">
          <div className="flex flex-col">
            <span className="text-black/50 text-sm font-medium">Name</span>
            {bill.customer_name}
          </div>
          <div className="flex flex-col">
            <span className="text-black/50 text-sm font-medium">Email</span>
            {bill.customer_email}
          </div>
          <div className="flex flex-col">
            <span className="text-black/50 text-sm font-medium">Phone</span>
            {bill.customer_phone}
          </div>
          <div className="flex flex-col">
            <span className="text-black/50 text-sm font-medium">Date</span>
            {bill.purchase_date}
          </div>
          <div className="flex flex-col">
            <span className="text-black/50 text-sm font-medium">Time</span>
            {bill.purchase_time}
          </div>
        </div>
      </div>
    </div>
  );
}
