import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/lib/store/services/auth/authApi";
import { Loader2 } from "lucide-react";
import type { User } from "@/types/auth";

export const ProtectedRoute = () => {
    const { data, isLoading, isFetching } = useGetCurrentUserQuery();
    const location = useLocation();

    if (isLoading || isFetching) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data?.data) {
        return <Navigate to="/auth/login" replace />;
    }

    const user = data.data as User;
    const isOnboardingPage = location.pathname === "/onboarding";
    const hasCompletedOnboarding = user?.hasCompletedOnboarding === true;

    if (!isOnboardingPage && !hasCompletedOnboarding) {
        return <Navigate to="/onboarding" replace />;
    }

    if (isOnboardingPage && hasCompletedOnboarding) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
