import { z } from 'zod';

export const loginUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, 'Password should not be empty!')
});

export type LoginUserForm = typeof loginUserSchema;

export const signupUserSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().email(),
	password: z.string().min(1, 'Password should not be empty!')
});

export type SignUpUserForm = typeof signupUserSchema;