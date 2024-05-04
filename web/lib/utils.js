import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const convertDateFormat = (inputDate) => {
  if(!inputDate) return null
  const dateParts = inputDate.split('/');
  const joinDate = new Date(dateParts[1], dateParts[0] - 1);

  return joinDate
}

export const getCurrentMonthStartAndEnd = () => {
  // Get the current date
  var currentDate = new Date();

  // Set the date to the first day of the current month
  currentDate.setDate(1);
  var startDate = currentDate.toISOString().split('T')[0];  // Format: YYYY-MM-DD

  // Set the date to the last day of the current month
  currentDate.setMonth(currentDate.getMonth() + 1);
  currentDate.setDate(0);
  var endDate = currentDate.toISOString().split('T')[0];  // Format: YYYY-MM-DD

  return {
    start: startDate,
    end: endDate
  };
}


export const drugInventorySorted = (drugList, filter = true) => {

  if (!drugList) return { drugs: [], provider: [] }

  const providerDetails = {};

  const list = drugList.map(([drug_id, drug]) => {

    const provider = drug.provider;
    
    if (!providerDetails[provider]) {
      providerDetails[provider] = {
        name: drug.provider,
        totalStock: drug.stock,
        totalValue: drug.stock * drug.price
      };
    } else {
      providerDetails[provider].totalStock += drug.stock;
      providerDetails[provider].totalValue += drug.stock * drug.price;
    }

    if (filter) {
      const expiryDate = convertDateFormat(drug.expiry_date)
      // Get the current date
      const currentDate = new Date();
      // Compare the expiry date with the current date
      if (expiryDate < currentDate) return null
    }

    return {
      drug_id,
      ...drug,
    }

  }).filter((drug) => drug);

  const provider = Object.values(providerDetails)

  return { drugs: list, provider }
}