import { z } from 'zod';

export const isRequired = (message) =>
    z.string().refine((data) => data.trim() !== '', {
        message,
    });

export const isAlphabets = (message) =>
    z.string().refine((data) => /^[a-zA-Z]+$/.test(data), {
        message,
    });


export const isPhoneNumber = z.string().refine((data) => /^[6789]\d{9}$/.test(data), {
    message: 'Invalid phone number',
});

export const isEmail = z.string().email();