import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/useRegister";
import { cn } from "@/lib/utils";

export const OnBoardingForm = () => {
    const { formData, errors, loading, handleChange, handleSubmit } =
        useRegister();

    return (
        <div className="w-full max-w-[480px] mx-auto flex flex-col font-['Mukta']">
            <div className="space-y-1 mb-6">
                <h1 className="text-foreground font-normal text-[32px] sm:text-[38px] leading-[100%] tracking-[0.0025em]">
                    Welcome to Medicare
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Tell us about your comapny
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-muted-foreground"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={cn(
                            "w-full bg-transparent border-b border-muted-foreground/40 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30",
                            errors.name && "border-destructive"
                        )}
                        placeholder="John Doe"
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">{errors.name}</p>
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
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={cn(
                            "w-full bg-transparent border-b border-muted-foreground/40 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30",
                            errors.companyName && "border-destructive"
                        )}
                        placeholder="Manilla"
                    />
                    {errors.companyName && (
                        <p className="text-xs text-destructive">{errors.companyName}</p>
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
                        name="industry"
                        type="text"
                        value={formData.industry}
                        onChange={handleChange}
                        className={cn(
                            "w-full bg-transparent border-b border-muted-foreground/40 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30",
                            errors.industry && "border-destructive"
                        )}
                        placeholder="Healthcare"
                    />
                    {errors.industry && (
                        <p className="text-xs text-destructive">{errors.industry}</p>
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
                        name="employeeCount"
                        type="text"
                        value={formData.employeeCount}
                        onChange={handleChange}
                        className={cn(
                            "w-full bg-transparent border-b border-muted-foreground/40 py-1.5 text-lg font-bold text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30",
                            errors.employeeCount && "border-destructive"
                        )}
                        placeholder="1 - 9"
                    />
                    {errors.employeeCount && (
                        <p className="text-xs text-destructive">{errors.employeeCount}</p>
                    )}
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Finish"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
