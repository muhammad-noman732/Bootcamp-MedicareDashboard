export const DashboardHome = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your Medicare dashboard
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Patients</h3>
                    <p className="text-3xl font-bold mt-2">1,234</p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Appointments Today</h3>
                    <p className="text-3xl font-bold mt-2">23</p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Pending Tasks</h3>
                    <p className="text-3xl font-bold mt-2">12</p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground">New Messages</h3>
                    <p className="text-3xl font-bold mt-2">2</p>
                </div>
            </div>
        </div>
    )
}
