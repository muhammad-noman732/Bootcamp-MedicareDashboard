import { useState } from 'react';
import type { RegisterFormData, RegisterFormErrors } from '@/types';

export const useRegister = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: 'John Doe',
        companyName: 'Manilla',
        industry: 'Healthcare',
        employeeCount: '1 - 9',
    });

    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof RegisterFormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: RegisterFormErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.companyName) newErrors.companyName = 'Company Name is required';
        if (!formData.industry) newErrors.industry = 'Industry is required';
        if (!formData.employeeCount) newErrors.employeeCount = 'Employee count is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return {
        formData,
        errors,
        loading,
        handleChange,
        handleSubmit,
    };
};
