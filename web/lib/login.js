import { z } from 'zod';

const loginSchema = z.object({
    username: z.string().min(5,
        { message: 'Username must be atleast 5 character' }).max(15, { message: 'Max 15 Characters' }
        ),
    password: z.string().min(6, { message: 'Password must be at least 8 characters long' }).max(16, { message: 'Max 16 Characters' })
});

export default loginSchema;