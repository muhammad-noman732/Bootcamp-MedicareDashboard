import DashboardLayout from "./components/dashboard/DashboardLayout";
import { DashboardHome } from "./pages/dashboard/home/DashboardHome";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PatientsPage from "./pages/dashboard/patients/PatientsPage";
import AddPatientPage from "./pages/dashboard/patients/AddPatientPage";
import SchedulePage from "./pages/dashboard/schedule/SchedulePage";
import SignupPage from "./pages/auth/signup/SignupPage";
import VerifyEmailPage from "./pages/auth/verifyEmail/VerifyEmailPage";
import LoginPage from "./pages/auth/login/LoginPage";
import { ProtectedRoute } from "./components/auth/guards/ProtectedRoute";
import { PublicRoute } from "./components/auth/guards/PublicRoute";

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
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "settings",
            element: (
              <div className="p-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-2">
                  Configure your account settings
                </p>
              </div>
            ),
          },
          {
            path: "patients",
            element: <PatientsPage />,
          },
          {
            path: "patients/add",
            element: <AddPatientPage />,
          },
          {
            path: "schedule",
            element: <SchedulePage />,
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
