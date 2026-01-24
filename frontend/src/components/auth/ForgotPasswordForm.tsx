import { Button } from "@/components/ui/button"
import { FormField } from "./FormField"
import { useForgotPassword } from "@/hooks/useForgotPassword"
import { Link } from "react-router-dom"

export const ForgotPasswordForm = () => {
  const { form, onSubmit, isLoading } = useForgotPassword();

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col font-['Mukta']">
      <div className="space-y-1 mb-6">
        <h1 className="text-foreground font-normal text-[32px] sm:text-[38px] leading-[100%] tracking-[0.0025em]">
          Reset password
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Enter the email you use to sign in and we'll send a reset link
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="space-y-1">
          <FormField
            id="email"
            type="email"
            label="Email"
            placeholder="you@company.com"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Remember your password?{" "}
          <Link to="/auth/login" className="text-primary hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}
