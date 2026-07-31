"use client";

import { useQuery } from "@tanstack/react-query";
import { IPayment } from "@/lib/type";
import { CreditCard, MapPin } from "lucide-react";
import Link from "next/link";
import { getTenantPayments } from "../../_actions/tenantAction";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
};

export default function TenantPaymentsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["tenant-payments"],
        queryFn: async () => {
            const res = await getTenantPayments();
            return res?.data as IPayment[];
        },
    });

    const payments = data || [];

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">My Payments</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {isLoading ? "Loading..." : `${payments.length} payments`}
                </p>
            </div>

            {isLoading && (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
                    ))}
                </div>
            )}

            {!isLoading && payments.length === 0 && (
                <div className="text-center py-16 text-muted-foreground text-sm bg-card border border-border rounded-xl flex flex-col items-center gap-3">
                    <CreditCard className="w-10 h-10 text-muted-foreground/30" />
                    <p>No payments yet.</p>
                </div>
            )}

            {!isLoading && payments.length > 0 && (
                <div className="flex flex-col gap-3">
                    {payments.map((payment) => (
                        <Link
                            key={payment.id}
                            href={`/dashboard/payments/${payment.id}`}
                            className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                        >
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-semibold text-foreground line-clamp-1">
                                    {payment.rentalRequest?.property.title || "Property"}
                                </span>
                                {payment.rentalRequest?.property && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {payment.rentalRequest.property.location}, {payment.rentalRequest.property.city}
                                    </span>
                                )}
                                <span className="text-xs text-muted-foreground/70">
                                    {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "Not paid yet"}
                                </span>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="font-bold text-foreground">${payment.amount.toLocaleString()}</span>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[payment.status] || "bg-gray-100 text-gray-700"}`}>
                                    {payment.status}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}