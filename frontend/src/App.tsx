import DashboardLayout from "./components/dashboard/DashboardLayout";
import { DashboardHome } from "./pages/dashboard/home/DashboardHome";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PatientsPage from "./pages/dashboard/patients/PatientsPage";
import AddPatientPage from "./pages/dashboard/patients/AddPatientPage";
import TasksPage from "./pages/dashboard/tasks/TasksPage";
import SchedulePage from "./pages/dashboard/schedule/SchedulePage";
import SignupPage from "./pages/auth/signup/SignupPage";
import VerifyEmailPage from "./pages/auth/verifyEmail/VerifyEmailPage";
import LoginPage from "./pages/auth/login/LoginPage";
import OnBoardingPage from "./pages/onBoarding/onBoarding";
import { ProtectedRoute } from "./components/auth/guards/ProtectedRoute";
import { PublicRoute } from "./components/auth/guards/PublicRoute";
import SettingsPage from "./pages/dashboard/settings/SettingsPage";
import AnalyticsPage from "./pages/dashboard/analytics/AnalyticsPage";
import SupportPage from "./pages/dashboard/support/SupportPage";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <SignupPage />,
      },
      {
        path: "/auth/signup",
        element: <SignupPage />,
      },
      {
        path: "/auth/verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "/auth/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/onboarding",
        element: <OnBoardingPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "patients",
            element: <PatientsPage />,
          },
          {
            path: "analytics",
            element: <AnalyticsPage />,
          },
          {
            path: "patients/add",
            element: <AddPatientPage />,
          },
          {
            path: "tasks",
            element: <TasksPage />,
          },
          {
            path: "schedule",
            element: <SchedulePage />,
          },
          {
            path: "support",
            element: <SupportPage />,
          },
        ],
      },
    ],
  },
]);

function App() {

  return (
    <RouterProvider router={router} />
    // <Nomi/>
  )
}

export default App
