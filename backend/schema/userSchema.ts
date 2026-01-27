import * as z from 'zod';

export const authSchema = z.object({
    email: z.string().email("Must be valid email"),
    password: z.string().min(8, "password must be at least 8 characters long"),
})


export const userSchema = z.object({
    name: z.string().min(5, "userName must be at least 5 character long"),
    compnyName: z.string().min(5, "companyName must be at least 5 characters"),
    industry: z.string().min(5, "industry must be at least 5 characters"),
    specialty: z.string(),
    employeeCount: z.number(),

})

export const loginSchema = z.object({
    email: z.string().email("Must be valid email").toLowerCase().trim(),
    password: z.string().min(1, 'Password is required')
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
    userName: z.string().min(5, "User name must be at least 5 characters long").optional(),
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    companyName: z.string().min(3, "Company name must be at least 3 characters").optional(),
    industry: z.string().optional(),
    employeeCount: z.string().optional(),
    specialty: z.string().optional(),
    phoneNumber: z.string().optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
});

export const onboardingSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    companyName: z.string().min(3, "Company name must be at least 3 characters long"),
    industry: z.string().min(3, "Industry must be at least 3 characters long"),
    employeeCount: z.string().min(1, "Employee count is required"),
    specialty: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Must be valid email").toLowerCase().trim(),
})

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm password is required")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export type LoginSchema = z.infer<typeof loginSchema>
export type AuthSchema = z.infer<typeof authSchema>
export type UserSchema = z.infer<typeof userSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
export type OnboardingSchema = z.infer<typeof onboardingSchema>
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
