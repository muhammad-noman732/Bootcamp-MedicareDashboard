import { useGoogleAuth } from "@/hooks/useGoogleAuth"
import { Loader2 } from "lucide-react"
import { GoogleLogin } from "@react-oauth/google"

export const GoogleLoginButton = () => {
    const { handleGoogleLoginSuccess, handleGoogleError, isLoading } = useGoogleAuth()

    return (
        <div className="w-full flex justify-center relative min-h-[52px]">
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
            )}
            <div className="w-full flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    theme="outline"
                    shape="rectangular"
                    size="large"
                    width="452"
                    text="signin_with"
                    logo_alignment="left"
                />
            </div>
        </div>
    )
}