import { Button } from "@/components/ui/button"
import dashboardImg from "@/assets/dashboard.svg"

export const DashboardPreview = () => {
    return (

        <div className="w-full h-full bg-primary flex flex-col items-center justify-between pt-16 pb-12 px-6 text-center text-primary-foreground font-['Mukta']">

            <div>
                <h2 className="text-xl font-bold uppercase tracking-wide">All in one dashboard</h2>
            </div>

            <div className="relative w-full flex-1 flex items-center justify-center min-h-0 py-8">
                <img
                    src={dashboardImg}
                    alt="Dashboard Preview"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                />
            </div>

            <div className="space-y-6 max-w-lg mx-auto mb-4">
                <p className="text-xl font-normal leading-relaxed opacity-90">
                    Keep track of all patient information in this section.
                </p>

                <Button
                    variant="secondary"
                    className="h-12 px-10 text-primary text-lg font-semibold bg-white hover:bg-white/90 rounded-xl"
                >
                    Learn more
                </Button>
            </div>
        </div>
    )

}