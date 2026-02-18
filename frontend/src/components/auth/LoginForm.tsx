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
    <div className="w-full max-w-[452px] mx-auto flex flex-col font-mukta">
      <div className="mb-6">
        <h1 className="text-black font-normal text-[36px] leading-tight mb-1">
          Welcome to Medicare
        </h1>
        <p className="text-sm sm:text-base font-medium text-gray-2 mt-2">
          Login to your account
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col">
        <div className="flex flex-col gap-[21px]">
          <div className="flex flex-col">
            <FormField
              id="email"
              {...register("email")}
              type="email"
              label="Email"
              placeholder="Johndoe2004@gmail.com"
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <FormField
              id="password"
              {...register("password")}
              type="password"
              label="Password"
              placeholder="************"
            />
            {errors.password && (
              <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Link to="/auth/forgot-password" global-id="forgot-password-link" className="text-primary text-base font-semibold hover:underline">
            Forgot password
          </Link>
        </div>

        <div className="space-y-4 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none"
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

      <div className="mt-6 text-center text-base text-gray-2">
        Don't have an account? <Link to="/auth/signup" global-id="signup-link" className="text-primary font-semibold hover:underline">Sign up</Link>
      </div>
    </div>
  )
}