"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITenantRentalRequest } from "@/lib/type";
import {
    FileText, CheckCircle, Building2, MapPin, Calendar,
    CreditCard, Star, Clock, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { createPayment, getTenantRentals } from "../_actions/tenantAction";

const PLACEHOLDER = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    ACTIVE: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-100 text-gray-700",
};

export default function TenantDashboardPage() {
    const queryClient = useQueryClient();
    const [payingId, setPayingId] = useState<string | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["tenant-rentals"],
        queryFn: async () => {
            const res = await getTenantRentals();
            return res?.data as ITenantRentalRequest[];
        },
    });

    const rentals = data || [];
    const pendingCount = rentals.filter((r) => r.status === "PENDING").length;
    const activeCount = rentals.filter((r) => r.status === "ACTIVE").length;
    const completedCount = rentals.filter((r) => r.status === "COMPLETED").length;

    const payMutation = useMutation({
        mutationFn: (rentalRequestId: string) => createPayment(rentalRequestId),
        onMutate: (rentalRequestId) => setPayingId(rentalRequestId),
        onSuccess: (res) => {
            if (res.success && res.data?.url) {
                // Redirect to Stripe Checkout
                window.location.href = res.data.url;
            } else {
                toast.error(res.message || "Failed to start payment");
                setPayingId(null);
            }
        },
        onError: () => {
            toast.error("Something went wrong starting payment");
            setPayingId(null);
        },
    });

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-1">Track your rental requests and payments</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { label: "Pending Requests", value: pendingCount, icon: FileText, color: "bg-yellow-50 text-yellow-600" },
                    { label: "Active Rentals", value: activeCount, icon: CheckCircle, color: "bg-green-50 text-green-600" },
                    { label: "Completed", value: completedCount, icon: Building2, color: "bg-gray-50 text-gray-600" },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{isLoading ? "—" : stat.value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Rental Requests */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-foreground">My Rental Requests</h2>

                {isLoading && (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />
                        ))}
                    </div>
                )}

                {!isLoading && rentals.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground text-sm bg-card border border-border rounded-xl flex flex-col items-center gap-3">
                        <Building2 className="w-10 h-10 text-muted-foreground/30" />
                        <p>No rental requests yet. Browse properties to get started!</p>
                    </div>
                )}

                {!isLoading && rentals.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {rentals.map((rental) => {
                            const image = rental.property.images && rental.property.images.length > 0
                                ? rental.property.images[0]
                                : PLACEHOLDER;

                            const canPay = rental.status === "APPROVED";
                            const isPayingThis = payMutation.isPending && payingId === rental.id;
                            const canReview = rental.status === "COMPLETED" && !rental.review;

                            return (
                                <div
                                    key={rental.id}
                                    className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4"
                                >
                                    {/* Property Image */}
                                    <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={image} alt={rental.property.title} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col gap-2 min-w-0">
                                        <div className="flex items-start justify-between gap-2 flex-wrap">
                                            <div>
                                                <Link
                                                    href={`/dashboard/rentals/${rental.id}`}
                                                    className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                                                >
                                                    {rental.property.title}
                                                </Link>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3" />
                                                    {rental.property.location}, {rental.property.city}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusColors[rental.status]}`}>
                                                {rental.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                            <span>${rental.property.price.toLocaleString()}/mo</span>
                                            {rental.moveInDate && (
                                                <>
                                                    <span className="text-muted-foreground/50">•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(rental.moveInDate).toLocaleDateString()}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Status-specific hints + actions */}
                                        {rental.status === "PENDING" && (
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                Waiting for landlord to review your request.
                                            </p>
                                        )}

                                        {rental.status === "REJECTED" && (
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                                                <XCircle className="w-3.5 h-3.5" />
                                                This request was declined by the landlord.
                                            </p>
                                        )}

                                        {canPay && (
                                            <div className="flex items-center gap-2 pt-1">
                                                <button
                                                    onClick={() => payMutation.mutate(rental.id)}
                                                    disabled={isPayingThis}
                                                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                                                >
                                                    <CreditCard className="w-3.5 h-3.5" />
                                                    {isPayingThis ? "Redirecting to payment..." : "Pay Now to Activate"}
                                                </button>
                                            </div>
                                        )}

                                        {rental.status === "ACTIVE" && (
                                            <p className="text-[11px] text-green-700 flex items-center gap-1 pt-1">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Your rental is active.
                                            </p>
                                        )}

                                        {canReview && (
                                            <div className="flex items-center gap-2 pt-1">
                                                <Link
                                                    href={`/dashboard/rentals/${rental.id}`}
                                                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                                                >
                                                    <Star className="w-3.5 h-3.5" />
                                                    Leave a Review
                                                </Link>
                                            </div>
                                        )}

                                        {rental.status === "COMPLETED" && rental.review && (
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                You reviewed this stay ({rental.review.rating}/5)
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}