"use client";

import { Building2 } from "lucide-react";

export default function GlobalLoader() {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-6">
                {/* Animated Logo */}
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />

                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                        <Building2 className="h-10 w-10 animate-pulse" />
                    </div>
                </div>

                {/* Brand */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-primary">
                        RentNest
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Finding your perfect home...
                    </p>
                </div>

                {/* Loading Bar */}
                <div className="h-1 w-52 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-1/2 animate-loader rounded-full bg-primary" />
                </div>
            </div>
        </div>
    );
}