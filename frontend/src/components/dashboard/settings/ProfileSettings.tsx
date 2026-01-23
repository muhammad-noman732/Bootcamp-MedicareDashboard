import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Camera, Mail, User as UserIcon, Building2, Briefcase, Phone, MapPin, Globe } from "lucide-react";

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
        <div className="space-y-8 pb-10">

            <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 via-background to-secondary/5 shadow-md">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="h-28 w-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-muted relative transition-transform duration-300 group-hover:scale-105">
                                {(preview || currentUser?.avatar) ? (
                                    <img
                                        src={preview || currentUser?.avatar || ""}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-secondary">
                                        <UserIcon className="h-12 w-12 opacity-50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">{currentUser?.name || "Your Name"}</h2>
                                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                                    <Mail className="h-3 w-3" /> {currentUser?.email}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                {currentUser?.specialty && (
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20">
                                        {currentUser.specialty}
                                    </span>
                                )}
                                {currentUser?.companyName && (
                                    <span className="inline-flex items-center rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground border border-muted-foreground/20">
                                        <Building2 className="mr-1 h-3 w-3" /> {currentUser.companyName}
                                    </span>
                                )}
                                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 border border-emerald-500/20">
                                    Active Account
                                </span>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <UserIcon className="h-5 w-5 text-primary" /> Personal Information
                                </CardTitle>
                                <CardDescription>This information will be displayed on your clinical profile.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <Input
                                                id="name"
                                                placeholder="Dr. Jane Smith"
                                                {...register("name")}
                                                className={`pl-9 ${errors.name ? "border-destructive" : ""}`}
                                            />
                                            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        </div>
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="userName">Username</Label>
                                        <div className="relative">
                                            <Input
                                                id="userName"
                                                placeholder="janesmith_md"
                                                {...register("userName")}
                                                className={`pl-9 ${errors.userName ? "border-destructive" : ""}`}
                                            />
                                            <span className="absolute left-3 top-2.5 text-muted-foreground font-medium text-sm">@</span>
                                        </div>
                                        {errors.userName && (
                                            <p className="text-sm text-destructive">{errors.userName.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
                                        <div className="relative">
                                            <Input
                                                id="phoneNumber"
                                                placeholder="+1 (555) 000-0000"
                                                {...register("phoneNumber")}
                                                className="pl-9"
                                            />
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="specialty">Professional Specialty</Label>
                                        <div className="relative">
                                            <Input
                                                id="specialty"
                                                placeholder="e.g. Cardiologist"
                                                {...register("specialty")}
                                                className="pl-9"
                                            />
                                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Professional Bio</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Briefly describe your professional background and clinical interests..."
                                        className="resize-none h-32"
                                        {...register("bio")}
                                    />
                                    <p className="text-[10px] text-muted-foreground text-right">Maximize professional credibility with a detailed bio.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" /> Location & Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Work Address</Label>
                                    <div className="relative">
                                        <Input
                                            id="address"
                                            placeholder="123 Medical Plaza, Suite 400, New York, NY"
                                            {...register("address")}
                                            className="pl-9"
                                        />
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>


                    <div className="space-y-6">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" /> Organization
                                </CardTitle>
                                <CardDescription>Hospital or Clinic details.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Organization Name</Label>
                                    <Input
                                        id="companyName"
                                        placeholder="City General Hospital"
                                        {...register("companyName")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry / Sector</Label>
                                    <div className="relative">
                                        <Input
                                            id="industry"
                                            placeholder="Healthcare"
                                            {...register("industry")}
                                            className="pl-9"
                                        />
                                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employeeCount">Team Size</Label>
                                    <Input
                                        id="employeeCount"
                                        placeholder="e.g. 50-100 staff"
                                        {...register("employeeCount")}
                                    />
                                </div>
                            </CardContent>
                            <div className="px-6 pb-6 pt-2">
                                <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground italic border">
                                    "Updating organization details helps us tailor your analytics dashboard."
                                </div>
                            </div>
                        </Card>

                        <div className="flex flex-col gap-3">
                            <Button type="submit" className="w-full shadow-lg h-11" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Settings"
                                )}
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground">
                                Last updated: {currentUser?.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString() : 'Never'}
                            </p>
                        </div>
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
            </form>
        </div>
    );
}
