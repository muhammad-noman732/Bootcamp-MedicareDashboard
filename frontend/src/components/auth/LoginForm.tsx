import { Button } from "@/components/ui/button"
import { FormField } from "./FormField"
import { Loader2 } from "lucide-react"
import { useLogin } from "@/hooks/useLogin"
import { Link } from "react-router-dom"
import { GoogleLoginButton } from "./GoogleLoginButton"


export const LoginForm = () => {
  const { form, isLoading, onSubmit } = useLogin()
  const { register, formState: { errors } } = form

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col font-['Mukta']">
      <div className="mb-6">
        <h1 className="text-[#000000] font-normal text-[36px] leading-tight mb-1">
          Welcome to Medicare
        </h1>
        <p className="text-[#828282] text-lg font-normal">
          Login to your account
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="space-y-3">
          <FormField
            id="email"
            {...register("email")}
            type="email"
            label="Email"
            placeholder="Johndoe2004@gmail.com"
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}

          <FormField
            id="password"
            {...register("password")}
            type="password"
            label="Password"
            placeholder="************"
          />
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">

          <Link to="/auth/forgot-password" global-id="forgot-password-link" className="text-primary text-base font-semibold hover:underline">
            Forgot password
          </Link>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] text-lg font-semibold bg-[#0000AC] hover:bg-[#00008F] text-white rounded-xl shadow-none"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              "Login"
            )}
          </Button>

          <GoogleLoginButton />
        </div>
      </form>

      <div className="mt-6 text-center text-base text-[#828282]">
        Don't have an account? <Link to="/auth/signup" global-id="signup-link" className="text-primary font-semibold hover:underline">Sign up</Link>
      </div>
    </div>
  )
}