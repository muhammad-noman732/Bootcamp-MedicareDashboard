import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/guards/ProtectedRoute";
import { PublicRoute } from "./components/auth/guards/PublicRoute";
import { Skeleton } from "./components/ui/skeleton";
import { Loader2 } from "lucide-react";

const SignupPage = lazy(() => import("./pages/auth/signup/SignupPage"));
const LoginPage = lazy(() => import("./pages/auth/login/LoginPage"));
const VerifyEmailPage = lazy(() => import("./pages/auth/verifyEmail/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/forgotPassword/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/resetPassword/ResetPasswordPage"));
const OnBoardingPage = lazy(() => import("./pages/onBoarding/onBoarding"));
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout"));
const DashboardHome = lazy(() => import("./pages/dashboard/home/DashboardHome").then(m => ({ default: m.DashboardHome })));
const PatientsPage = lazy(() => import("./pages/dashboard/patients/PatientsPage"));
const AddPatientPage = lazy(() => import("./pages/dashboard/patients/AddPatientPage"));
const TasksPage = lazy(() => import("./pages/dashboard/tasks/TasksPage"));
const SchedulePage = lazy(() => import("./pages/dashboard/schedule/SchedulePage"));
const SettingsPage = lazy(() => import("./pages/dashboard/settings/SettingsPage"));
const AnalyticsPage = lazy(() => import("./pages/dashboard/analytics/AnalyticsPage"));
const SupportPage = lazy(() => import("./pages/dashboard/support/SupportPage"));
const AuthPageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background">
    <div className="relative">
      <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <Loader2 className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
    </div>
    <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">Initializing...</p>
  </div>
);

const DashboardPageLoader = () => (
  <div className="flex flex-col h-screen w-full bg-background p-6 space-y-8">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-48 rounded-md" />
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
    <div className="flex gap-6 pt-4">
      <Skeleton className="flex-1 h-[400px] rounded-xl" />
      <Skeleton className="w-[300px] h-[400px] rounded-xl hidden lg:block" />
    </div>
  </div>
);

const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType>,
  type: "auth" | "dashboard" = "dashboard"
) => (
  <Suspense fallback={type === "auth" ? <AuthPageLoader /> : <DashboardPageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: withSuspense(SignupPage, "auth"),
      },
      {
        path: "/auth/signup",
        element: withSuspense(SignupPage, "auth"),
      },
      {
        path: "/auth/verify-email",
        element: withSuspense(VerifyEmailPage, "auth"),
      },
      {
        path: "/auth/login",
        element: withSuspense(LoginPage, "auth"),
      },
      {
        path: "/auth/forgot-password",
        element: withSuspense(ForgotPasswordPage, "auth"),
      },
      {
        path: "/auth/reset-password",
        element: withSuspense(ResetPasswordPage, "auth"),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/onboarding",
        element: withSuspense(OnBoardingPage),
      },
      {
        path: "/dashboard",
        element: withSuspense(DashboardLayout),
        children: [
          {
            index: true,
            element: withSuspense(DashboardHome),
          },
          {
            path: "settings",
            element: withSuspense(SettingsPage),
          },
          {
            path: "patients",
            element: withSuspense(PatientsPage),
          },
          {
            path: "analytics",
            element: withSuspense(AnalyticsPage),
          },
          {
            path: "patients/add",
            element: withSuspense(AddPatientPage),
          },
          {
            path: "tasks",
            element: withSuspense(TasksPage),
          },
          {
            path: "schedule",
            element: withSuspense(SchedulePage),
          },
          {
            path: "support",
            element: withSuspense(SupportPage),
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App