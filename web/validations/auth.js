import { z } from 'zod';
import { isAlphabets, isEmail, isRequired } from '.';

const isPassword = z
  .string()
  .min(6, { message: 'Password must be at least 8 characters long' })
  .max(16, { message: 'Max 16 Characters' });

const isPhoneNumber = z.string().refine((data) => /^[6789]\d{9}$/.test(data), {
  message: 'Invalid phone number',
});

export const nameScheme = z.object({
  firstName: isRequired('First name is required').and(
    isAlphabets('First name can only contain alphabets')
  ),
  lastName: isRequired('Last name is required').and(
    isAlphabets('Last name can only contain alphabets')
  ),
})

export const loginSchema = z.object({
  email: isEmail,
  password: isPassword
});

export const emailSchema = z.object({
  email: isEmail,
})
export const phoneSchema = z.object({
  phone: isPhoneNumber,
})

export const passwordSchema = z.object({
  password: z.string().refine((data) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(data), {
    message: 'Password not strong enough',
  }),
  confirmPassword: z.string(),
}).refine(data => data.confirmPassword === data.password, {
  message: 'Passwords do not match',
  path: ["confirmPassword"], // path of error
})

export const registerSchema = z.object({
  username: isRequired('Username is required').and(
    isAlphabets('username can only contain alphabets')
  ),
  email: isEmail,
}).and(passwordSchema);