import { Button } from "@/components/ui/button"
import { FormField } from "./FormField"
import { useResetPassword } from "@/hooks/useResetPassword"
import { Link } from "react-router-dom"

export const ResetPasswordForm = () => {
  const { form, onSubmit, isLoading, token } = useResetPassword();

  if (!token) {
    return (
      <div className="w-full max-w-[452px] mx-auto flex flex-col font-mukta">
        <div className="space-y-4">
          <h1 className="text-black font-normal text-[32px] sm:text-[38px] leading-[100%] tracking-[0.0025em]">
            Invalid Link
          </h1>
          <p className="text-sm sm:text-base font-medium text-gray-2 mt-2">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link to="/auth/forgot-password" className="text-primary hover:underline font-semibold text-sm">
            Request new password reset
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[452px] mx-auto flex flex-col font-mukta">
      <div className="space-y-1 mb-6">
        <h1 className="text-black font-normal text-[32px] sm:text-[38px] leading-[100%] tracking-[0.0025em]">
          Create new password
        </h1>
        <p className="text-sm sm:text-base font-medium text-gray-2 mt-2">
          Enter your new password. Make sure it's at least 8 characters long.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col">
        <div className="flex flex-col gap-[21px]">
          <div className="flex flex-col">
            <FormField
              id="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter new password"
              {...form.register("newPassword")}
            />
            {form.formState.errors.newPassword && (
              <p className="text-destructive text-sm mt-1">{form.formState.errors.newPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <FormField
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm new password"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm font-medium text-gray-2">
          Remember your password?{" "}
          <Link to="/auth/login" className="text-primary hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}