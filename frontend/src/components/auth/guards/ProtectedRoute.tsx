import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/lib/store/services/auth/authApi";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
    const { data, isLoading } = useGetCurrentUserQuery();

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data?.data) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};
