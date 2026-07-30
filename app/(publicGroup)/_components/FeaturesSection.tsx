import { Home, Shield, MapPin } from "lucide-react";

const features = [
    {
        icon: Home,
        title: "Wide Selection",
        description: "Browse thousands of verified rental properties across the country.",
    },
    {
        icon: Shield,
        title: "Secure Payments",
        description: "Pay rent safely with our Stripe-powered payment system.",
    },
    {
        icon: MapPin,
        title: "Find Nearby",
        description: "Filter properties by location, price, and amenities easily.",
    },
];

export default function FeaturesSection() {
    return (
        <div className="bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Why Choose RentNest?
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                        Everything you need to find and manage your rental.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="flex flex-col items-center text-center gap-3 p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}