import { useState } from "react";

export const useSupport = () => {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: "How do I export patient records?",
            answer: "You can export patient records by navigating to the Patients page and selecting the 'Export' option from the action menu."
        },
        {
            question: "Is my medical data encrypted?",
            answer: "Yes, all data in Medicare is encrypted both in transit and at rest using industry-standard AES-256 encryption."
        },
        {
            question: "How can I update my clinic's billing information?",
            answer: "Go to Settings > Billing to update your credit card details or view past invoices."
        },
        {
            question: "Can I share access with other staff members?",
            answer: "Staff management is available in the Multi-user settings under your profile menu."
        }
    ];

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    return {
        faqs,
        activeFaq,
        toggleFaq
    };
};
