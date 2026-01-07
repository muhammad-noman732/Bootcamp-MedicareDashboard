import { ArrowBigDown } from "lucide-react";
import { useState } from "react"
import Child from "./components/Child";
function Nomi() {
  const [bool, setBool] = useState(false);
  const [id, setId] = useState<any>(null)

  const faqs = [
    {
      id: "faq-001",
      question: "How do I book a new appointment?",
      answer:
        "You can book a new appointment by navigating to the Appointments section, selecting an available date and time, and confirming your booking with the provider."
    },
    {
      id: "faq-002",
      question: "Where can I see my upcoming appointments?",
      answer:
        "All upcoming appointments are displayed on the dashboard under the Daily Appointments view, with options to switch to weekly or monthly views."
    },
    {
      id: "faq-003",
      question: "Can I reschedule or cancel an appointment?",
      answer:
        "Yes. Open the appointment details and choose either Reschedule or Cancel. Changes may be restricted based on provider policy."
    },
    {
      id: "faq-004",
      question: "What filters are available in the appointments list?",
      answer:
        "You can filter appointments by date, provider, status (upcoming, completed, canceled), and appointment type."
    },
    {
      id: "faq-005",
      question: "How do I view appointment details?",
      answer:
        "Click on any appointment card or row to open the detailed view, which includes provider information, time, location, and notes."
    },
    {
      id: "faq-006",
      question: "Why is my appointment marked as completed?",
      answer:
        "An appointment is marked as completed once the scheduled time has passed and the provider has finalized the visit."
    },
    {
      id: "faq-007",
      question: "Can I download or print my appointment history?",
      answer:
        "Yes. Use the export option in the Appointments section to download or print your appointment history."
    },
    {
      id: "faq-008",
      question: "Who should I contact if I see incorrect appointment information?",
      answer:
        "If any appointment details are incorrect, please contact support or your healthcare provider directly through the Help section."
    }
  ];

  const fn = () => { }
  console.log(
    "parent rerendered"
  )

  return (
    <div>
      <Child bool={bool} fn={fn} />
      <button onClick={() => setBool(!bool)}>rerender</button><br />
      <button onClick={() => setId("hello")}>id</button>

    </div>
  )
}

export default Nomi
