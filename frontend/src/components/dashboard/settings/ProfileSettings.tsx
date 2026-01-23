import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Camera } from "lucide-react";

export function ProfileSettings() {
    const {
        form,
        onSubmit,
        isLoading,
        currentUser,
        preview,
        fileInputRef,
        handleAvatarClick
    } = useUpdateProfile();

    const { register, formState: { errors } } = form;
    const { ref: avatarRef, ...avatarRest } = register("avatar");

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        Update your photo and personal details here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-muted bg-muted relative">
                                    {(preview || currentUser?.avatar) ? (
                                        <img
                                            src={preview || currentUser?.avatar || ""}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-secondary">
                                            <span className="text-2xl font-bold">
                                                {currentUser?.name?.charAt(0) || currentUser?.userName?.charAt(0) || "U"}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <Input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    {...avatarRest}
                                    ref={(e) => {
                                        avatarRef(e);
                                        if (fileInputRef) fileInputRef.current = e;
                                    }}
                                />
                            </div>
                            <div className="flex-1 space-y-1 text-center sm:text-left">
                                <h3 className="font-medium">Profile Photo</h3>
                                <p className="text-sm text-muted-foreground">
                                    Click on the image to upload. Valid formats: JPG, PNG, WEBP. Max size: 5MB.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter your full name"
                                    {...register("name")}
                                    className={errors.name ? "border-destructive" : ""}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="userName">Username</Label>
                                <Input
                                    id="userName"
                                    placeholder="Enter username"
                                    {...register("userName")}
                                    className={errors.userName ? "border-destructive" : ""}
                                />
                                {errors.userName && (
                                    <p className="text-sm text-destructive">{errors.userName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    placeholder="Enter company name"
                                    {...register("companyName")}
                                    className={errors.companyName ? "border-destructive" : ""}
                                />
                                {errors.companyName && (
                                    <p className="text-sm text-destructive">{errors.companyName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input
                                    id="industry"
                                    placeholder="e.g. Healthcare, Technology"
                                    {...register("industry")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="employeeCount">Employee Count</Label>
                                <Input
                                    id="employeeCount"
                                    placeholder="e.g. 1-10, 50+"
                                    {...register("employeeCount")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialty">Specialty</Label>
                                <Input
                                    id="specialty"
                                    placeholder="e.g. Cardiology"
                                    {...register("specialty")}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
