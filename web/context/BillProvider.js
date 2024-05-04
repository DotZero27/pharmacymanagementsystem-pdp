"use client";
import { createContext, useState } from "react";

export const BillContext = createContext(null);

export function BillProvider({ children }) {
  const [billItems, setBillItems] = useState([]);

  const addToBill = (product) => {
    const existingItem = billItems.find(
      (billItem) => billItem.drug_id === product.drug_id
    );

    // Prepare the item with only necessary properties
    const newItem = {
      drug_id: product.drug_id,
      drug_name: product.drug_name,
      provider: product.provider,
      expiry_date: product.expiry_date,
      batch_number: product.batch_number,
      quantity: 1,
      amountpayable: product.price,
    };

    // If the item is already in the bill, update its quantity and amount payable
    if (existingItem) {
      setBillItems((prevItems) =>
        prevItems.map((billItem) =>
          billItem.drug_id === product.drug_id
            ? {
                ...billItem,
                quantity: billItem.quantity + 1,
                amountpayable: (billItem.quantity + 1) * product.price,
              }
            : billItem
        )
      );
    } else {
      // If the item is not in the bill, add the new item
      setBillItems((prevItems) => [...prevItems, newItem]);
    }
  };

  const removeFromBill = (product) => {
    setBillItems((prevItems) =>
      prevItems
        .map((item) =>
          item.drug_id === product.drug_id
            ? {
                ...item,
                quantity: item.quantity > 1 ? item.quantity - 1 : 0,
                amountpayable:
                  item.quantity > 1
                    ? ((item.quantity - 1) * item.amountpayable) / item.quantity
                    : 0,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const resetBill = () => setBillItems([]);

  const getTotal = () => {
    return billItems.reduce((total, item) => {
      return total + item.amountpayable;
    }, 0);
  };

  return (
    <BillContext.Provider
      value={{ billItems, addToBill, removeFromBill, getTotal, resetBill }}
    >
      {children}
    </BillContext.Provider>
  );
}
