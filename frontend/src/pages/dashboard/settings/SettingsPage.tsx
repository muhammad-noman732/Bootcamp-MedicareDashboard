import { useState } from "react";
import { ProfileSettings } from "@/components/dashboard/settings/ProfileSettings";
import { SecuritySettings } from "@/components/dashboard/settings/SecuritySettings";
import { cn } from "@/lib/utils";

const tabs = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
] as const;

type TabId = typeof tabs[number]["id"];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>("profile");

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "justify-start rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-left transition-colors cursor-pointer",
                                    activeTab === tab.id
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground bg-transparent"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-3xl">
                    <div className={cn("space-y-6", activeTab === "profile" ? "block" : "hidden")}>
                        <ProfileSettings />
                    </div>
                    <div className={cn("space-y-6", activeTab === "security" ? "block" : "hidden")}>
                        <SecuritySettings />
                    </div>
                </div>
            </div>
        </div>
    );
}