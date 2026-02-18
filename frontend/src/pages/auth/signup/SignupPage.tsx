import { SignupForm } from "@/components/auth/SignupForm"
import { DashboardPreview } from "@/components/onBoarding/DashboardPreview"

export const SignupPage = () => {
  return (
    <div className="w-full min-h-screen flex justify-center ">
      <div className="w-full max-w-[1440px] grid grid-cols-1 xl:grid-cols-[42%_58%] xl:h-screen xl:overflow-hidden  gap-y-12 xl:gap-y-0">
        <div className="flex flex-col pt-10 px-6 sm:px-12 xl:px-16 overflow-hidden">
          <SignupForm />
        </div>

        <div className="w-full h-[600px] xl:h-full relative overflow-hidden bg-primary">
          <DashboardPreview />
        </div>
      </div>
    </div>
  )
}

export default SignupPage