const stats = [
    { label: "Properties Listed", value: "2,400+" },
    { label: "Happy Tenants", value: "1,800+" },
    { label: "Verified Landlords", value: "600+" },
    { label: "Cities Covered", value: "12+" },
];

export default function StatsSection() {
    return (
        <div className="bg-background border-y border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col gap-1">
                            <span className="text-3xl font-bold text-primary">
                                {stat.value}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}