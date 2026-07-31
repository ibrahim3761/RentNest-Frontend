"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { IPayment } from "@/lib/type";
import { CreditCard, MapPin, Calendar, Hash } from "lucide-react";
import Link from "next/link";
import { getPaymentById } from "@/app/(dashboardGroup)/_actions/tenantAction";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
};

export default function PaymentDetailPage() {
    const params = useParams<{ id: string }>();

    const { data, isLoading } = useQuery({
        queryKey: ["tenant-payment", params.id],
        queryFn: async () => {
            const res = await getPaymentById(params.id);
            return res?.data as IPayment;
        },
        enabled: !!params.id,
    });

    if (isLoading) {
        return <div className="h-64 bg-muted animate-pulse rounded-xl max-w-2xl" />;
    }

    if (!data) {
        return (
            <div className="text-center py-16 text-muted-foreground text-sm bg-card border border-border rounded-xl">
                Payment not found.
            </div>
        );
    }

    const payment = data;

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    Payment Details
                </h1>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-3xl font-bold text-foreground">${payment.amount.toLocaleString()}</p>
                        {payment.rentalRequest?.property && (
                            <Link
                                href={`/dashboard/tenant/rentals/${payment.rentalRequestId}`}
                                className="text-sm text-primary hover:underline"
                            >
                                {payment.rentalRequest.property.title}
                            </Link>
                        )}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[payment.status] || "bg-gray-100 text-gray-700"}`}>
                        {payment.status}
                    </span>
                </div>

                {payment.rentalRequest?.property && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {payment.rentalRequest.property.location}, {payment.rentalRequest.property.city}
                    </p>
                )}

                <div className="flex flex-col gap-2 pt-3 border-t border-border">
                    {payment.paidAt && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" /> Paid at
                            </span>
                            <span className="text-foreground font-medium">
                                {new Date(payment.paidAt).toLocaleString()}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5" /> Transaction ID
                        </span>
                        <span className="text-foreground font-mono text-xs">{payment.transactionId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5" /> Session ID
                        </span>
                        <span className="text-foreground font-mono text-xs break-all text-right max-w-[60%]">
                            {payment.sessionId}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Created
                        </span>
                        <span className="text-foreground font-medium">
                            {new Date(payment.createdAt).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}