'use client";'
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    CreditCard,
    User,
    Building2,
    MapPin,
    Bed,
    Bath,
    Ruler,
    Calendar,
    Hash,
    CheckCircle2,
    Clock,
} from "lucide-react";
import Link from "next/link";
import { getPaymentById } from "@/app/(dashboardGroup)/_actions/Adminactions";

const PLACEHOLDER =
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop";

const statusColors: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
};

const rentalStatusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    ACTIVE: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-100 text-gray-700",
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminPaymentDetailPage({ params }: PageProps) {
    const { id } = await params;
    const res = await getPaymentById(id);

    if (!res?.success || !res?.data) {
        notFound();
    }

    const payment = res.data;
    const { tenant, rentalRequest } = payment;
    const { property } = rentalRequest;
    const image = property.images && property.images.length > 0
        ? property.images[0]
        : PLACEHOLDER;

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Back */}
            <Link
                href="/admin-dashboard/payments"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Payments
            </Link>

            <div>
                <h1 className="text-2xl font-bold text-foreground">Payment Details</h1>
                <p className="text-muted-foreground text-sm mt-1">Full breakdown of this transaction</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Payment Info */}
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold text-foreground">Payment Info</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {/* Amount */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Amount</span>
                            <span className="text-2xl font-bold text-primary">
                                ${payment.amount.toLocaleString()}
                            </span>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[payment.status] || "bg-gray-100 text-gray-700"}`}>
                                {payment.status}
                            </span>
                        </div>

                        {/* Paid At */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Paid At
                            </span>
                            <span className="text-sm font-medium">
                                {payment.paidAt
                                    ? new Date(payment.paidAt).toLocaleString()
                                    : "—"}
                            </span>
                        </div>

                        {/* Created At */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                Created At
                            </span>
                            <span className="text-sm font-medium">
                                {new Date(payment.createdAt).toLocaleString()}
                            </span>
                        </div>

                        <div className="border-t border-border pt-3 flex flex-col gap-2">
                            {/* Transaction ID */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Hash className="w-3 h-3" />
                                    Transaction ID
                                </span>
                                <span className="text-xs font-mono bg-muted px-2 py-1.5 rounded-lg break-all">
                                    {payment.transactionId || "—"}
                                </span>
                            </div>

                            {/* Session ID */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Hash className="w-3 h-3" />
                                    Session ID
                                </span>
                                <span className="text-xs font-mono bg-muted px-2 py-1.5 rounded-lg break-all">
                                    {payment.sessionId || "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tenant Info */}
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border">
                        <User className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold text-foreground">Tenant Info</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            {tenant.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={tenant.avatarUrl}
                                    alt={tenant.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-primary font-bold text-lg">
                                    {tenant.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <p className="font-semibold text-foreground truncate">{tenant.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{tenant.email}</p>
                            <p className="text-sm text-muted-foreground">{tenant.phone}</p>
                            <p className="text-xs text-muted-foreground">{tenant.address}</p>
                        </div>
                    </div>
                    <div className="border-t border-border pt-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Role</span>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                                {tenant.role}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Account Status</span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                tenant.status === "ACTIVE"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}>
                                {tenant.status}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Member Since</span>
                            <span className="text-sm font-medium">
                                {new Date(tenant.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Rental Request Info */}
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold text-foreground">Rental Request</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Request Status</span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rentalStatusColors[rentalRequest.status] || "bg-gray-100 text-gray-700"}`}>
                                {rentalRequest.status}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Move-in Date</span>
                            <span className="text-sm font-medium">
                                {rentalRequest.moveInDate
                                    ? new Date(rentalRequest.moveInDate).toLocaleDateString()
                                    : "Not specified"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Requested On</span>
                            <span className="text-sm font-medium">
                                {new Date(rentalRequest.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        {rentalRequest.message && (
                            <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                                <span className="text-xs text-muted-foreground">Tenant Message</span>
                                <p className="text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2 leading-relaxed">
                                    {rentalRequest.message}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Property Info */}
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-border">
                        <Building2 className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold text-foreground">Property</h2>
                    </div>

                    {/* Property Image */}
                    <div className="h-36 rounded-xl overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image}
                            alt={property.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="font-semibold text-foreground">{property.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {property.location}, {property.city}
                        </p>
                        <p className="text-lg font-bold text-primary">
                            ${property.price.toLocaleString()}
                            <span className="text-muted-foreground font-normal text-sm">/month</span>
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                            <span className="flex items-center gap-1">
                                <Bed className="w-3.5 h-3.5" />
                                {property.bedrooms} Beds
                            </span>
                            <span className="flex items-center gap-1">
                                <Bath className="w-3.5 h-3.5" />
                                {property.bathrooms} Baths
                            </span>
                            <span className="flex items-center gap-1">
                                <Ruler className="w-3.5 h-3.5" />
                                {property.area} sqft
                            </span>
                        </div>
                    </div>

                    <Link
                        href={`/properties/${property.id}`}
                        className="text-xs text-primary hover:underline"
                    >
                        View property page →
                    </Link>
                </div>
            </div>
        </div>
    );
}