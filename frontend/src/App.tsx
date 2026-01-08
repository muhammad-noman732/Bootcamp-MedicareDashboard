import DashboardLayout from "./components/dashboard/DashboardLayout";
import { DashboardHome } from "./pages/dashboard/home/DashboardHome";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PatientsPage from "./pages/dashboard/patients/PatientsPage";
import AddPatientPage from "./pages/dashboard/patients/AddPatientPage";
import SchedulePage from "./pages/dashboard/schedule/SchedulePage";
import SignupPage from "./pages/auth/SignupPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignupPage />,
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
]);

function App() {

  return (
    <RouterProvider router={router} />
    // <Nomi/>
  )
}

export default App
