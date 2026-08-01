import { CheckCircle2, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-6 text-center shadow-lg">
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Your payment has been processed and your rental is now active.
                        You can view the details in your dashboard.
                    </p>
                </div>

                {/* Divider */}
                <div className="w-full border-t border-border" />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Link href="/dashboard" className="flex-1">
                        <Button className="w-full cursor-pointer gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Go to Dashboard
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full cursor-pointer gap-2">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}