import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateProfileMutation } from "@/lib/store/services/auth/authApi";
import { toast } from "sonner";
import { useGetCurrentUserQuery } from "@/lib/store/services/auth/authApi";
import { useEffect, useRef, useState } from "react";
import type { BackendErrorData } from "@/types";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const updateProfileSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    userName: z.string().min(5, "Username must be at least 5 characters").optional(),
    companyName: z.string().min(3, "Company name must be at least 3 characters").optional(),
    industry: z.string().optional(),
    employeeCount: z.string().optional(),
    specialty: z.string().optional(),
    phoneNumber: z.string().optional(),
    bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
    address: z.string().optional(),
    avatar: z
        .any()
        .refine((files) => !files || files.length === 0 || files instanceof FileList, "Expected a file")
        .refine(
            (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
            `Max file size is 5MB.`
        )
        .refine(
            (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const useUpdateProfile = () => {
    const { data: userData, isLoading: isUserLoading } = useGetCurrentUserQuery();
    const [updateProfile, { isLoading, isError, error }] = useUpdateProfileMutation();
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: "",
            userName: "",
            companyName: "",
            industry: "",
            employeeCount: "",
            specialty: "",
            phoneNumber: "",
            bio: "",
            address: "",
        },
    });

    const { watch } = form;
    const avatarFile = watch("avatar");

    useEffect(() => {
        if (userData?.data) {
            form.reset({
                name: userData.data.name || "",
                userName: userData.data.userName || "",
                companyName: userData.data.companyName || "",
                industry: userData.data.industry || "",
                employeeCount: userData.data.employeeCount || "",
                specialty: userData.data.specialty || "",
                phoneNumber: userData.data.phoneNumber || "",
                bio: userData.data.bio || "",
                address: userData.data.address || ""
            });
        }
    }, [userData, form]);

    useEffect(() => {
        if (avatarFile && avatarFile.length > 0 && typeof avatarFile !== 'string') {
            const file = avatarFile[0];
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [avatarFile]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = async (data: UpdateProfileFormValues) => {
        try {
            const formData = new FormData();
            if (data.name) formData.append("name", data.name);
            if (data.userName) formData.append("userName", data.userName);
            if (data.companyName) formData.append("companyName", data.companyName);
            if (data.industry) formData.append("industry", data.industry);
            if (data.employeeCount) formData.append("employeeCount", data.employeeCount);
            if (data.specialty) formData.append("specialty", data.specialty);
            if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
            if (data.bio) formData.append("bio", data.bio);
            if (data.address) formData.append("address", data.address);

            if (data.avatar && data.avatar.length > 0) {
                formData.append("avatar", data.avatar[0]);
            }

            await updateProfile(formData).unwrap();

            toast.success("Profile Updated", {
                description: "Your profile has been successfully updated.",
            });
        } catch (err) {
            console.error("Update profile failed", err);
        }
    };

    useEffect(() => {
        if (isError && error) {
            let errorMessage = "Failed to update profile";
            if ('data' in error && error.data) {
                const errorData = error.data as BackendErrorData;
                if (errorData.message) {
                    errorMessage = errorData.message;
                }
            }
            toast.error("Error", {
                description: errorMessage,
            });
        }
    }, [isError, error]);

    return {
        form,
        isLoading: isLoading || isUserLoading,
        onSubmit: form.handleSubmit(onSubmit),
        currentUser: userData?.data,
        preview,
        fileInputRef,
        handleAvatarClick
    };
};
