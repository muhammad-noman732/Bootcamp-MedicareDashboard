import { useAppDispatch } from "@/lib/store/hooks"
import { authApi, useLogoutMutation } from "@/lib/store/services/auth/authApi"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useLogout = () => {
    const [logoutMutation, { isLoading }] = useLogoutMutation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap()
            dispatch(authApi.util.resetApiState())
            toast.success("Logged out successfully")
            navigate("/auth/login", { replace: true })
        } catch (error) {
            dispatch(authApi.util.resetApiState())
            navigate("/auth/login", { replace: true })
            toast.error(error instanceof Error ? error.message : "Something went wrong during logout")
        }
    }

    return {
        handleLogout,
        isLoading
    }
}