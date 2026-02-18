import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useOnboarding";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const OnBoardingForm = () => {
    const { form, isLoading, onSubmit } = useOnboarding();
    const { register, formState: { errors } } = form;

    return (
        <div className="w-full max-w-[452px] mx-auto flex flex-col font-mukta">
            <div className="mb-6 text-left">
                <h1 className="text-black font-normal text-[38px] leading-[100%] tracking-[0.0025em]">
                    Welcome to Medicare
                </h1>
                <p className="text-sm sm:text-base font-medium text-gray-2 mt-2">
                    Tell us about your company
                </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col">
                <div className="flex flex-col h-[68px]">
                    <label
                        htmlFor="name"
                        className="text-[16px] font-medium text-gray-2 leading-[100%] tracking-[0.001em]"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register("name")}
                        className={cn(
                            "w-full bg-transparent border-b border-gray-3 py-2 text-[22px] font-medium text-black leading-[100%] tracking-[0.0015em] focus:outline-none focus:border-primary transition-colors placeholder:text-gray-3/30 h-full appearance-none",
                            errors.name && "border-destructive"
                        )}
                        placeholder="John Doe"
                        disabled={isLoading}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                    )}
                </div>

                <div className="flex flex-col h-[68px] mt-[21px]">
                    <label
                        htmlFor="companyName"
                        className="text-[16px] font-medium text-gray-2 leading-[100%] tracking-[0.001em]"
                    >
                        Company Name
                    </label>
                    <input
                        id="companyName"
                        type="text"
                        {...register("companyName")}
                        className={cn(
                            "w-full bg-transparent border-b border-gray-3 py-2 text-[22px] font-medium text-black leading-[100%] tracking-[0.0015em] focus:outline-none focus:border-primary transition-colors placeholder:text-gray-3/30 h-full appearance-none",
                            errors.companyName && "border-destructive"
                        )}
                        placeholder="Manilla"
                        disabled={isLoading}
                    />
                    {errors.companyName && (
                        <p className="text-xs text-destructive mt-1">{errors.companyName.message}</p>
                    )}
                </div>

                <div className="flex flex-col h-[68px] mt-[21px]">
                    <label
                        htmlFor="industry"
                        className="text-[16px] font-medium text-gray-2 leading-[100%] tracking-[0.001em]"
                    >
                        Industry
                    </label>
                    <input
                        id="industry"
                        type="text"
                        {...register("industry")}
                        className={cn(
                            "w-full bg-transparent border-b border-gray-3 py-2 text-[22px] font-medium text-black leading-[100%] tracking-[0.0015em] focus:outline-none focus:border-primary transition-colors placeholder:text-gray-3/30 h-full appearance-none",
                            errors.industry && "border-destructive"
                        )}
                        placeholder="Healthcare"
                        disabled={isLoading}
                    />
                    {errors.industry && (
                        <p className="text-xs text-destructive mt-1">{errors.industry.message}</p>
                    )}
                </div>

                <div className="flex flex-col h-[68px] mt-[21px]">
                    <label
                        htmlFor="employeeCount"
                        className="text-[16px] font-medium text-gray-2 leading-[100%] tracking-[0.001em]"
                    >
                        How many employees do you have?
                    </label>
                    <input
                        id="employeeCount"
                        type="text"
                        {...register("employeeCount")}
                        className={cn(
                            "w-full bg-transparent border-b border-gray-3 py-2 text-[22px] font-medium text-black leading-[100%] tracking-[0.0015em] focus:outline-none focus:border-primary transition-colors placeholder:text-gray-3/30 h-full appearance-none",
                            errors.employeeCount && "border-destructive"
                        )}
                        placeholder="1 - 9"
                        disabled={isLoading}
                    />
                    {errors.employeeCount && (
                        <p className="text-xs text-destructive mt-1">{errors.employeeCount.message}</p>
                    )}
                </div>

                <div className="pt-8">
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