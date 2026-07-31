"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ITenantRentalRequest } from "@/lib/type";
import {
    MapPin, Bed, Bath, Ruler, Tag, User, Calendar,
    CreditCard, Star, CheckCircle, Clock, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { createPayment, createReview, getRentalRequestById } from "@/app/(dashboardGroup)/_actions/tenantAction";

const PLACEHOLDER = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    ACTIVE: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-100 text-gray-700",
};

export default function RentalDetailPage() {
    const params = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["tenant-rental", params.id],
        queryFn: async () => {
            const res = await getRentalRequestById(params.id);
            return res?.data as ITenantRentalRequest;
        },
        enabled: !!params.id,
    });

    const payMutation = useMutation({
        mutationFn: () => createPayment(params.id),
        onSuccess: (res) => {
            if (res.success && res.data?.url) {
                window.location.href = res.data.url;
            } else {
                toast.error(res.message || "Failed to start payment");
            }
        },
        onError: () => toast.error("Something went wrong starting payment"),
    });

    const reviewMutation = useMutation({
        mutationFn: () =>
            createReview({
                propertyId: data!.property.id,
                rentalRequestId: data!.id,
                rating,
                comment,
            }),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Review submitted, thank you!");
                queryClient.invalidateQueries({ queryKey: ["tenant-rental", params.id] });
                queryClient.invalidateQueries({ queryKey: ["tenant-rentals"] });
            } else {
                toast.error(res.message || "Failed to submit review");
            }
        },
        onError: () => toast.error("Something went wrong submitting your review"),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="h-64 bg-muted animate-pulse rounded-xl" />
                <div className="h-40 bg-muted animate-pulse rounded-xl" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-16 text-muted-foreground text-sm bg-card border border-border rounded-xl">
                Rental request not found.
            </div>
        );
    }

    const rental = data;
    const image = rental.property.images && rental.property.images.length > 0
        ? rental.property.images[0]
        : PLACEHOLDER;

    const canPay = rental.status === "APPROVED";
    const canReview = rental.status === "COMPLETED" && !rental.review;

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            {/* Property card */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="relative h-56 bg-muted overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={rental.property.title} className="w-full h-full object-cover" />
                    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[rental.status]}`}>
                        {rental.status}
                    </span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                        <h1 className="text-xl font-bold text-foreground">{rental.property.title}</h1>
                        <span className="text-primary font-bold text-lg shrink-0">
                            ${rental.property.price.toLocaleString()}
                            <span className="text-muted-foreground font-normal text-sm">/mo</span>
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {rental.property.location}, {rental.property.city}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{rental.property.bedrooms} bed</span>
                        <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{rental.property.bathrooms} bath</span>
                        <span className="flex items-center gap-1"><Ruler className="w-4 h-4" />{rental.property.area} sqft</span>
                        {rental.property.category && (
                            <span className="flex items-center gap-1"><Tag className="w-4 h-4" />{rental.property.category.name}</span>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground">{rental.property.description}</p>

                    {rental.property.landlord && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                            <User className="w-4 h-4" />
                            Landlord: <span className="text-foreground font-medium">{rental.property.landlord.name}</span>
                        </div>
                    )}

                    {rental.moveInDate && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Move-in date: {new Date(rental.moveInDate).toLocaleDateString()}
                        </p>
                    )}

                    {rental.message && (
                        <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                            &quot;{rental.message}&quot;
                        </p>
                    )}
                </div>
            </div>

            {/* Payment section */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment
                </h2>

                {rental.status === "PENDING" && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Waiting for the landlord to approve your request before you can pay.
                    </p>
                )}

                {rental.status === "REJECTED" && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        This request was rejected. Payment is not available.
                    </p>
                )}

                {canPay && (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                            Your request has been approved. Complete payment to activate your rental.
                        </p>
                        <button
                            onClick={() => payMutation.mutate()}
                            disabled={payMutation.isPending}
                            className="self-start flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <CreditCard className="w-4 h-4" />
                            {payMutation.isPending ? "Redirecting to payment..." : "Pay Now"}
                        </button>
                    </div>
                )}

                {rental.status === "ACTIVE" && !rental.payment && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Your rental is active.
                    </p>
                )}

                {rental.payment && (
                    <div className="flex flex-col gap-1 text-sm bg-muted/50 rounded-lg p-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-medium text-foreground">${rental.payment.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-medium text-foreground">{rental.payment.status}</span>
                        </div>
                        {rental.payment.paidAt && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Paid at</span>
                                <span className="font-medium text-foreground">
                                    {new Date(rental.payment.paidAt).toLocaleString()}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Transaction ID</span>
                            <span className="font-mono text-xs text-foreground">{rental.payment.transactionId}</span>
                        </div>
                    </div>
                )}

                {(canPay || rental.status === "PENDING" || rental.status === "REJECTED") && !rental.payment && (
                    <button
                        disabled
                        title={
                            rental.status === "PENDING"
                                ? "Available once your request is approved"
                                : "Not available for this request"
                        }
                        className="hidden"
                    />
                )}
            </div>

            {/* Review section — only relevant once COMPLETED */}
            {rental.status === "COMPLETED" && (
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Review
                    </h2>

                    {rental.review ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < rental.review!.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">{rental.review.comment}</p>
                            <p className="text-xs text-muted-foreground/70">
                                Reviewed on {new Date(rental.review.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ) : canReview ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                reviewMutation.mutate();
                            }}
                            className="flex flex-col gap-3"
                        >
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-foreground">Rating</label>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const value = i + 1;
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setRating(value)}
                                                className="cursor-pointer"
                                            >
                                                <Star
                                                    className={`w-6 h-6 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-foreground">Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    minLength={10}
                                    rows={3}
                                    placeholder="Share your experience..."
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={reviewMutation.isPending}
                                className="self-start text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    ) : null}
                </div>
            )}
        </div>
    );
}