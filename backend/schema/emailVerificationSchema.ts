import { z } from "zod";

export const verifyEmailSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP must contain only numbers"),
});

export const resendOTPSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
export type ResendOTPSchema = z.infer<typeof resendOTPSchema>;
