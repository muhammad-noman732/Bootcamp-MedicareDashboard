import { Button } from "@/components/ui/button"
import { FormField } from "./FormField"

export const LoginForm = () => {
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

      <form className="flex flex-col gap-3">
        <FormField id="email" name="email" type="email" label="Email" placeholder="you@company.com" />
        <FormField id="password" name="password" type="password" label="Password" placeholder="••••••••" />

        <div className="pt-2">
          <Button type="button" className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl">
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}
