import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useOnboarding";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const OnBoardingForm = () => {
    const { form, isLoading, onSubmit } = useOnboarding();
    const { register, formState: { errors } } = form;

    return (
        <div className="w-full max-w-[480px] mx-auto flex flex-col font-['Mukta']">
            <div className="space-y-1 mb-6">
                <h1 className="text-foreground font-normal text-[32px] sm:text-[38px] leading-[100%] tracking-[0.0025em]">
                    Welcome to Medicare
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Tell us about your company
                </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-muted-foreground"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register("name")}
                        className={cn(
                            "w-full bg-transparent border-b border-muted-foreground/40 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30",
                            errors.name && "border-destructive"
                        )}
                        placeholder="John Doe"
                        disabled={isLoading}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="companyName"
                        className="text-sm font-medium text-muted-foreground"
                    >
                        Company Name
                    </label>
                    <input
                        id="companyName"
                        type="text"
                        {...register("companyName")}
                        className={cn(
                            "w-full bg-transparent border-b border-muted-foreground/40 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30",
                            errors.companyName && "border-destructive"
                        )}
                        placeholder="Manilla"
                        disabled={isLoading}
                    />
                    {errors.companyName && (
                        <p className="text-xs text-destructive">{errors.companyName.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="industry"
                        className="text-sm font-medium text-muted-foreground"
                    >
                        Industry
                    </label>
                    <input
                        id="industry"
                        type="text"
                        {...register("industry")}
                        className={cn(
                            "w-full bg-transparent border-b border-muted-foreground/40 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30",
                            errors.industry && "border-destructive"
                        )}
                        placeholder="Healthcare"
                        disabled={isLoading}
                    />
                    {errors.industry && (
                        <p className="text-xs text-destructive">{errors.industry.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="employeeCount"
                        className="text-sm font-medium text-muted-foreground"
                    >
                        How many employees do you have?
                    </label>
                    <input
                        id="employeeCount"
                        type="text"
                        {...register("employeeCount")}
                        className={cn(
                            "w-full bg-transparent border-b border-muted-foreground/40 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30",
                            errors.employeeCount && "border-destructive"
                        )}
                        placeholder="1 - 9"
                        disabled={isLoading}
                    />
                    {errors.employeeCount && (
                        <p className="text-xs text-destructive">{errors.employeeCount.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="specialty"
                        className="text-sm font-medium text-muted-foreground"
                    >
                        Specialty (Optional)
                    </label>
                    <input
                        id="specialty"
                        type="text"
                        {...register("specialty")}
                        className={cn(
                            "w-full bg-transparent border-b border-muted-foreground/40 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30",
                            errors.specialty && "border-destructive"
                        )}
                        placeholder="Cardiology"
                        disabled={isLoading}
                    />
                    {errors.specialty && (
                        <p className="text-xs text-destructive">{errors.specialty.message}</p>
                    )}
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Finish"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};