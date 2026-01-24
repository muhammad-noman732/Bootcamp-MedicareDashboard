import { GoogleLogin } from "@react-oauth/google"
import { useGoogleAuth } from "@/hooks/useGoogleAuth"
import { Loader2 } from "lucide-react"

export const GoogleLoginButton = () => {
    const { handleGoogleLoginSuccess, handleGoogleError, isLoading } = useGoogleAuth()

    return (
        <div className="w-full flex justify-center relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-md">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
            )}
            <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                shape="rectangular"
                width="360"
                text="continue_with"
            />
        </div>
    )
}
