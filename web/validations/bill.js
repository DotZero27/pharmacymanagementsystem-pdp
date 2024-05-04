import {z} from 'zod'
import { isEmail, isPhoneNumber, isRequired } from '.'

export const billUserSchema = z.object({
    name:isRequired('Name is required'),
    email:isEmail,
    phone:isPhoneNumber
})