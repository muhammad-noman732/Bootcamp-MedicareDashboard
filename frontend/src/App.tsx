import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "./components/auth/guards/ProtectedRoute";
import { PublicRoute } from "./components/auth/guards/PublicRoute";

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
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: withSuspense(SignupPage),
      },
      {
        path: "/auth/signup",
        element: withSuspense(SignupPage),
      },
      {
        path: "/auth/verify-email",
        element: withSuspense(VerifyEmailPage),
      },
      {
        path: "/auth/login",
        element: withSuspense(LoginPage),
      },
      {
        path: "/auth/forgot-password",
        element: withSuspense(ForgotPasswordPage),
      },
      {
        path: "/auth/reset-password",
        element: withSuspense(ResetPasswordPage),
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