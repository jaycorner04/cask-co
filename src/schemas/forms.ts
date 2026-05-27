import { z } from 'zod'

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  address: z.string().min(8, 'Address is required'),
  pincode: z.string().min(6, 'Pincode is required'),
})

export const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Use a valid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
  phone: z.string().optional(),
  dob: z.string().optional(),
  ageConfirm: z.boolean().optional(),
})

export type CheckoutForm = z.infer<typeof checkoutSchema>
export type AuthForm = z.infer<typeof authSchema>
