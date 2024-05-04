"use client";
import React, { useState } from "react";
import { useBill } from "@/hooks/useBill";
import { Search as Icon, Plus } from "lucide-react";

import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { format } from "date-fns";
import { convertDateFormat } from "@/lib/utils";
import useToggleState from "@/hooks/useToggleState";
import { zodResolver } from "@hookform/resolvers/zod";
import { billUserSchema } from "@/validations/bill";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { API } from "@/config/api";
import Loading from "../Loading";

export default function BillGenerateForm({ drugs }) {
  const { billItems, addToBill, removeFromBill, getTotal, resetBill } =
    useBill();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { state: show, open, close } = useToggleState();

  const form = useForm({
    resolver: zodResolver(billUserSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const filteredProducts = drugs.filter(
    (medicine) =>
      medicine.drug_id.toLowerCase().includes(query.toLowerCase()) ||
      medicine.drug_name.toLowerCase().includes(query.toLowerCase()) ||
      medicine.provider.toLowerCase().includes(query.toLowerCase()) ||
      medicine.bin_number.toLowerCase().includes(query.toLowerCase()) ||
      medicine.batch_number.toLowerCase().includes(query.toLowerCase())
  );

  const { mutate: generateBill, isPending } = useMutation({
    mutationFn: async (user) => {
      if (billItems.length === 0) {
        toast({
          title: "No items added",
          description: "Add items and try again",
        });
        return;
      }

      const bill = {
        ...user,
        meds: [...billItems],
      };
      const data = await API.post("generate_bill", bill);
      return data;
    },
    onError: (err) => {
      resetBill();
      console.log(err);

      const errorMessage = err.response?.data?.description;

      return toast({
        title: errorMessage || "Try again later!",
      });
    },
    onSuccess: ({ bill }) => {
      if (bill?.id) {
        resetBill();
        toast({
          title: "Bill Generated Successfully!",
        });
        router.push(`/dashboard/reports/bills/${bill.id}`);
      }
    },
  });

  const onSubmit = async (data) => {
    generateBill(data);
  };

  const getProductFromBill = (id) => {
    const item = billItems.find((item) => item.drug_id === id);
    return item?.quantity || 0;
  };

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div>
          <div className="flex text-2xl font-bold items-center gap-2">
            <Link href={"/dashboard/inventory"}>Generate Bill </Link>
          </div>
          <span>Create and Print Pharmacy Invoices</span>
        </div>
        <Dialog
          open={show}
          onOpenChange={(value) => (value ? open() : close())}
        >
          {billItems.length > 0 && (
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="flex items-center gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <Loading className="w-5 h-5" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Product
                  </>
                )}
              </Button>
            </DialogTrigger>
          )}

          <DialogContent className="p-0 bg-transparent border-none shadow-none top-[15%] max-w-4xl w-full mx-auto">
            <div className="relative">
              <div className="bg-white shadow-lg p-2 rounded-lg">
                <div className="relative flex">
                  <div className="absolute p-1 m-1 top-0 right-0">
                    <Icon className="opacity-40" />
                  </div>

                  <Input
                    className="focus-visible:ring-none bg-[#E3EBF3] border-none placeholder:text-black/60 font-medium"
                    placeholder="Search for medicine here..."
                    type="text"
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <ul className="absolute top-16 w-full max-h-[650px] overflow-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <li
                      key={product.drug_id}
                      className="grid grid-cols-5 gap-4 mb-3 text-sm items-center bg-white p-8 py-6 rounded-lg border"
                    >
                      <div>
                        <span className="italic text-xs">
                          {product.provider}
                        </span>
                        <div className="font-semibold text-sm">
                          {product.drug_name}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs">Expiry Date</p>
                        <span className="text-sm font-bold">
                          {format(
                            convertDateFormat(product.expiry_date),
                            "MMM/yy"
                          )}{" "}
                        </span>
                      </div>
                      <div className="text-left flex flex-col">
                        <div>
                          <span className="text-sm">BATCH</span>{" "}
                          <span className="font-semibold">
                            {product.batch_number}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm">BIN</span>{" "}
                          <span className="font-semibold">
                            {product.bin_number}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-lg tracking-widest">x{getProductFromBill(product.drug_id)}</span>
                      </div>
                      <div className="flex justify-between h-full w-full gap-2">
                        {getProductFromBill(product.drug_id) > 0 ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-full focus-visible:ring-none"
                            onClick={() => removeFromBill(product)}
                          >
                            Remove
                          </Button>
                        ) : null}

                        <Button
                          size="sm"
                          className="flex gap-2 items-center w-full h-full focus-visible:ring-none"
                          onClick={() => addToBill(product)}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="w-full text-center mt-4 p-2 shadow-sm border rounded-md bg-white text-gray-700">
                    No Results Found
                  </div>
                )}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-8 mt-8">
        <>
          <div className="w-full relative overflow-auto flex flex-col justify-between border-2 border-gray-400/40 rounded-md">
            {billItems.length === 0 ? (
              <Button
                variant="ghost"
                className="flex-1 gap-2 border-dashed border-spacing-10 m-2 border-2"
                onClick={open}
              >
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            ) : (
              <>
                <table className="flex-1 max-h-[500px] text-left rtl:text-right text-gray-500">
                  <thead className="text-gray-700 capitalize bg-white border-b-2 border-gray-400/40">
                    <tr className="font-medium text-sm">
                      <th scope="col" className="px-6 py-3 font-mono">
                        Medicine name
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Batch number
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Provider
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {billItems.map((drug, i) => {
                      return (
                        <tr
                          key={drug.drug_id}
                          className="bg-white border-b border-gray-400/40 font-normal text-black"
                        >
                          <td
                            scope="row"
                            className="px-6 py-4 max-w-[250px] text-ellipsis overflow-hidden  whitespace-nowrap font-bold"
                          >
                            {drug.drug_name}
                          </td>
                          <td className="px-6 py-4">{drug.batch_number}</td>
                          <td className="px-6 py-4">{drug.provider}</td>
                          <td className="px-6 py-4 font-mono">
                            x {drug.quantity}
                          </td>
                          <td className="px-6 py-4">Rs.{drug.amountpayable}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex justify-end bg-white font-bold text-2xl p-4">
                  Total: {getTotal()}
                </div>
                <div className="flex justify-end bg-gray-300">
                  <Button
                    variant="ghost"
                    className="flex gap-4 items-center text-black/70 bg-gray-300 h-6 rounded-sm m-1"
                    size="sm"
                    onClick={open}
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="max-w-md w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Customer Name"
                          {...field}
                          className="h-14"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Customer Email"
                          type="tel"
                          {...field}
                          className="h-14"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Customer Phone"
                          type="tel"
                          {...field}
                          className="h-14"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="h-14" disabled={isPending}>
                  {isPending ? <Loading className="w-5 h-5" /> : "Generate"}
                </Button>
              </form>
            </Form>
          </div>
        </>
      </div>
    </>
  );
}
