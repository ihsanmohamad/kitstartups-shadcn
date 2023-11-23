import { z } from 'zod';

export const loginUserSchema = z.object({
	email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Email must be a valid email.' }),
        password: z
        .string({ required_error: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(64, { message: 'Password must be less than 64 characters' }),
});

export type LoginUserForm = typeof loginUserSchema;

export const resetUserSchema = z.object({
	email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Email must be a valid email.' })
});

export type ResetUserForm = typeof resetUserSchema;

export const resetPasswordSchema = z.object({
	password: z
        .string({ required_error: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(64, { message: 'Password must be less than 64 characters' }),
});

export type ResetPasswordForm = typeof resetPasswordSchema;

export const signupUserSchema = z.object({
	firstName: z.string().trim().optional(),
	lastName: z.string().trim().optional(),
	email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Email must be a valid email.' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(64, { message: 'Password must be less than 64 characters' }),
    confirm_password: z
        .string({ required_error: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(64, { message: 'Password must be less than 64 characters' })
})
.superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
        ctx.addIssue({
            code: 'custom',
            message: 'Password and Confirm Password must match',
            path: ['password']
        });
        ctx.addIssue({
            code: 'custom',
            message: 'Password and Confirm Password must match',
            path: ['confirm_password']
        });
    }
});

export type SignUpUserForm = typeof signupUserSchema;