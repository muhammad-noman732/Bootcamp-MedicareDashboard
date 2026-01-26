import { useGoogleLoginMutation } from "@/lib/store/services/auth/authApi"
import { useNavigate } from "react-router-dom"
import type { CredentialResponse } from "@react-oauth/google"
import { toast } from "sonner"
export const useGoogleAuth = () => {
    const [googleLogin, { isLoading }] = useGoogleLoginMutation()
    const navigate = useNavigate();

    const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
        if (!response.credential) {
            toast.error("Google login failed. Please try again.");
            return;
        }
        try {
            const result = await googleLogin({ idToken: response.credential }).unwrap();
            if (result.status === "success") {
                toast.success(result.message);

                if (result.data.user.hasCompletedOnboarding) {
                    navigate("/dashboard");
                } else {
                    navigate("/onboarding");
                }
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }

    }
    const handleGoogleError = () => {
        toast.error("Google login process interrupted")
    }
    return {
        handleGoogleLoginSuccess,
        handleGoogleError,
        isLoading
    }




}
