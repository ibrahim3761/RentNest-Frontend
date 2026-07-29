import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative bg-primary overflow-hidden">
            {/* Background dot pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
                <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">

                    {/* Badge */}
                    <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
                        <MapPin className="w-3.5 h-3.5" />
                        Trusted Rental Platform
                    </span>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        Find Your Perfect{" "}
                        <span className="text-white/80 underline decoration-wavy decoration-white/40">
                            Rental Home
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                        RentNest connects tenants with verified landlords. Browse, request, and move in — all in one place.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <Link href="/properties" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold gap-2 cursor-pointer"
                            >
                                <Search className="w-4 h-4" />
                                Browse Properties
                            </Button>
                        </Link>
                        <Link href="/register" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white font-semibold cursor-pointer"
                            >
                                List Your Property
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>

            {/* Wave divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 28C840 36 960 42 1080 40C1200 38 1320 28 1380 23L1440 18V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
                        fill="white"
                        className="dark:fill-background"
                    />
                </svg>
            </div>
        </section>
    );
}