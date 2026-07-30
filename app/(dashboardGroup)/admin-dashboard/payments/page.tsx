"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { getAllPayments } from "../../_actions/Adminactions";
import { useRouter } from "next/navigation";

type Payment = {
    id: string;
    amount: number;
    status: string;
    transactionId: string | null;
    sessionId: string | null;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
    tenant: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
    };
    rentalRequest: {
        id: string;
        status: string;
        property: {
            id: string;
            title: string;
            location: string;
            city: string;
            price: number;
        };
    };
};

const statusColors: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
};

export default function AdminPaymentsPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-payments"],
        queryFn: async () => {
            const res = await getAllPayments();
            return res?.data as Payment[];
        },
    });

    const router = useRouter();
    const payments = data || [];
    const totalRevenue = payments
        .filter((p) => p.status === "COMPLETED")
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Payments</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {isLoading ? "Loading..." : `${payments.length} total transactions`}
                    </p>
                </div>
                <div className="bg-card border border-border rounded-xl px-5 py-3 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                        <p className="text-xs text-muted-foreground">Total Revenue</p>
                        <p className="text-lg font-bold text-primary">
                            ${totalRevenue.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tenant</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Property</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Paid At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading &&
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <td key={j} className="px-4 py-3">
                                                <div className="h-4 bg-muted animate-pulse rounded w-24" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            {!isLoading &&
                                payments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        onClick={() =>
                                            router.push(`/admin-dashboard/payments/${payment.id}`)
                                        }
                                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{payment.tenant.name}</div>
                                            <div className="text-xs text-muted-foreground">{payment.tenant.email}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium line-clamp-1 max-w-[180px]">
                                                {payment.rentalRequest.property.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {payment.rentalRequest.property.location}, {payment.rentalRequest.property.city}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-primary">
                                            ${payment.amount.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[payment.status] || "bg-gray-100 text-gray-700"}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">
                                            {payment.paidAt
                                                ? new Date(payment.paidAt).toLocaleDateString()
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {isError && (
                        <div className="text-center py-10 text-destructive text-sm">
                            Failed to load payments. Please refresh.
                        </div>
                    )}
                    {!isLoading && !isError && payments.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground text-sm">
                            No payments found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}