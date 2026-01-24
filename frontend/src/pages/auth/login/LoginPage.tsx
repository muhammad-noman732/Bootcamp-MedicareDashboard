import { LoginForm } from "@/components/auth/LoginForm"
import { DashboardPreview } from "@/components/onBoarding/DashboardPreview"

export const LoginPage = () => {
  return (
    <div className="w-full min-h-screen flex justify-center bg-background">
      <div className="w-full max-w-[1440px] grid grid-cols-1 xl:grid-cols-[42%_58%] xl:h-screen xl:overflow-hidden shadow-sm gap-y-12 xl:gap-y-0">
        <div className="flex flex-col pt-10 px-6 sm:px-12 xl:px-16 overflow-hidden">
          <LoginForm />
        </div>

        <div className="w-full h-[600px] xl:h-full relative overflow-hidden">
          <DashboardPreview />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
