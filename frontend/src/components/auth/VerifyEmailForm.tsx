import { Button } from "@/components/ui/button"
import { OTPInput } from "./OTPInput"
import { Loader2 } from "lucide-react"
import { useVerifyEmail } from "@/hooks/useVerifyEmail"
import { Controller } from "react-hook-form"

export const VerifyEmailForm = () => {
    const { form, isLoading, isResending, onSubmit, handleResendOtp } = useVerifyEmail()
    const { control, formState: { errors } } = form

    return (
        <div className="w-full max-w-[480px] mx-auto flex flex-col font-['Mukta']">
            <div className="space-y-1 mb-6">
                <h1 className="text-foreground font-normal text-[32px] sm:text-[38px] leading-[100%] tracking-[0.0025em]">
                    Check your email
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    We sent a verification code to your email.
                </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-8">
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <Controller
                            control={control}
                            name="otp"
                            render={({ field }) => (
                                <OTPInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isLoading}
                                />
                            )}
                        />
                    </div>
                    {errors.otp && (
                        <p className="text-destructive text-sm text-center">{errors.otp.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify email"
                        )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-muted-foreground">Didn't receive the code?</span>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isResending || isLoading}
                            className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isResending ? "Sending..." : "Click to resend"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
