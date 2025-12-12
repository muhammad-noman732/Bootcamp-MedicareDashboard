import DashboardLayout from "./components/dashboard/DashboardLayout"
import { Register } from "./pages/auth/register/Register"
import { DashboardHome } from "./pages/dashboard/DashboardHome"
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <div className="p-6">
          <h1 className="text-3xl font-bold">Welcome to Medicare Dashboard</h1>
          <p className="text-muted-foreground mt-2">Select a menu item from the sidebar to get started</p>
        </div>
      },
      {
        path: "home",
        element: <DashboardHome />
      },
      {
        path: "settings",
        element: <div className="p-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Configure your account settings</p>
        </div>
      }
    ]
  }
]);

function App() {

  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
