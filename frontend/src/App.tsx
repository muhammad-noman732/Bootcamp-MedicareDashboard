// import DashboardLayout from "./components/dashboard/DashboardLayout"
// import { DashboardHome } from "./pages/dashboard/home/DashboardHome"
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import PatientsPage from "./pages/dashboard/patients/PatientsPage";
// import AddPatientPage from "./pages/dashboard/patients/AddPatientPage";
// import SchedulePage from "./pages/dashboard/schedule/SchedulePage";
// import SignupPage from "./pages/auth/SignupPage";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <SignupPage/>
//   },
//   {
//     path: "/dashboard",
//     element: <DashboardLayout />,
//     children: [
//       {
//         index: true,
//         element:<DashboardHome/>
//       },
//       {
//         path: "settings",
//         element: <div className="p-6">
//           <h1 className="text-3xl font-bold">Settings</h1>
//           <p className="text-muted-foreground mt-2">Configure your account settings</p>
//         </div>
//       },
//            {
//         path: "patients",
//         element: <PatientsPage/>
//       },
//       {
//         path: "patients/add",
//         element: <AddPatientPage/>
//       },
//       {
//         path: "schedule",
//         element: <SchedulePage/>
//       }
//     ]
//   }
// ]);

// function App() {

//   return (
//     <RouterProvider router={router} />
//     // <Nomi/>
//   )
// }

// export default App





const App = () => {
  const[activeId , setActiveId] = useState<any>(null)
  const faqData = [
  {
    id: 1,
    question: "What is idempotency?",
    answer: "Idempotency means doing the same action multiple times gives the same result."
  },
  {
    id: 2,
    question: "Why is idempotency important?",
    answer: "It prevents duplicate operations when requests are repeated."
  },
  {
    id: 3,
    question: "Is GET request idempotent?",
    answer: "Yes, calling GET multiple times does not change server data."
  },
  {
    id: 4,
    question: "Is POST request idempotent?",
    answer: "No, POST usually creates new data each time it is called."
  },
  {
    id: 5,
    question: "Which HTTP methods are idempotent?",
    answer: "GET, PUT, DELETE are idempotent."
  },
  {
    id: 6,
    question: "Real-life example of idempotency?",
    answer: "Pressing an elevator button many times still calls the elevator once."
  }
];
const [state , setState] = useState(faqData)

  return (
    <div>
      {faqData.map((data)=>(
        <div key={data.id}>
          <div className="flex justify-between">
            <p>{data.question}</p>
            <ChevronRight onClick={()=>setActiveId(activeId ? null : data.id)}/>
          </div>
          {activeId == data.id &&  <p>{data.answer}</p> }
         
        </div>
      ))}
    </div>
  )
}

export default App
