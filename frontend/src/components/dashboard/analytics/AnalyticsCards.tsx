import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CheckCircle2, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { AnalyticsSummary } from "@/types/analytics";

interface AnalyticsCardsProps {
    summary: AnalyticsSummary;
}

export function AnalyticsCards({ summary }: AnalyticsCardsProps) {
    const cards = [
        {
            title: "Total Patients",
            value: summary.totalPatients.count,
            growth: summary.totalPatients.growth,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Monthly Appointments",
            value: summary.monthlyAppointments.count,
            growth: summary.monthlyAppointments.growth,
            icon: Calendar,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            title: "Completion Rate",
            value: `${summary.completionRate.percentage}%`,
            detail: `${summary.completionRate.completed}/${summary.completionRate.total} Tasks`,
            icon: CheckCircle2,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
        {
            title: "Active Treatments",
            value: summary.activeTreatments.count,
            growth: summary.activeTreatments.growth,
            icon: Activity,
            color: "text-rose-600",
            bgColor: "bg-rose-50",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => (
                <Card key={idx} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                            <card.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <div className="flex items-center mt-1">
                            {card.growth !== undefined ? (
                                <>
                                    {card.growth >= 0 ? (
                                        <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 text-rose-500 mr-1" />
                                    )}
                                    <span className={`text-xs font-medium ${card.growth >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                        {Math.abs(card.growth)}%
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-1">from last month</span>
                                </>
                            ) : (
                                <span className="text-xs text-muted-foreground">{card.detail}</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}