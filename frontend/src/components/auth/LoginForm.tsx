import { Button } from "@/components/ui/button"
import { FormField } from "./FormField"
import { Loader2 } from "lucide-react"
import { useLogin } from "@/hooks/useLogin"

export const LoginForm = () => {
  const { form, isLoading, onSubmit } = useLogin()
  const { register, formState: { errors } } = form

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col font-['Mukta']">
      <div className="space-y-1 mb-6">
        <h1 className="text-foreground font-normal text-[32px] sm:text-[38px] leading-[100%] tracking-[0.0025em]">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Log in with your work email and password
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="space-y-1">
          <FormField
            id="email"
            {...register("email")}
            type="email"
            label="Email"
            placeholder="you@company.com"
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <FormField
            id="password"
            {...register("password")}
            type="password"
            label="Password"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
