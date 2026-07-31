"use client";

import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

export default function Error({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
            <Card className="w-full max-w-lg p-8 text-center shadow-xl border">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-10 w-10 text-destructive" />
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-foreground">
                    Oops! Something went wrong
                </h1>

                {/* Description */}
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    We couldn&apos;t complete your request because an unexpected error
                    occurred. Please try again or return to the homepage.
                </p>

                {/* Error Message (Development Only) */}
                {process.env.NODE_ENV === "development" && (
                    <div className="mt-5 rounded-lg bg-muted p-3 text-left">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                            Error Details
                        </p>
                        <p className="text-xs wrap-break-word text-destructive">
                            {error.message}
                        </p>
                    </div>
                )}

                {/* Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => unstable_retry()}
                        className="cursor-pointer"
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>

                    <Link href="/">
                        <Button
                            variant="outline"
                            className="cursor-pointer w-full sm:w-auto"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}