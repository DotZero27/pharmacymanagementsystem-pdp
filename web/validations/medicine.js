import { isRequired } from ".";
import { z } from 'zod';

export const medicineSchema = z.object({
  drug_id: isRequired('Medicine ID is required'),
  drug_name: isRequired('Name is required'),
  price: z.coerce.number().gte(5, 'Must be 5 and above'),
  stock: z.coerce.number().gte(1, 'Must be 1 and above'),
  expiry_date: z.date({
    required_error: "Expiry date is required.",
    invalid_type_error: "Invalid Expiry Date",
  }),
  provider: isRequired('Medication Provider is required'),
  usage: isRequired('Usage Instruction is required'),
  side_effects: isRequired('Side Effects is required'),
  bin_number: isRequired('BIN number is required'),
  batch_number: isRequired('BATCH number is required'),
});