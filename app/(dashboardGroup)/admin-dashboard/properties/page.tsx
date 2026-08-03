"use client";

import { IProperty } from "@/lib/type";
import { Building2, MapPin, Tag, Trash2, AlertTriangle, ExternalLink } from "lucide-react";
import { getAdminProperties, deleteProperty } from "../../_actions/Adminactions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminPropertiesPage() {
    const queryClient = useQueryClient();
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-properties"],
        queryFn: async () => {
            const res = await getAdminProperties();
            return res?.data as IProperty[];
        },
    });

    const properties = data || [];

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteProperty(id),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Property deleted successfully!");
                setConfirmDeleteId(null);
                queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
            } else {
                toast.error(res.message || "Failed to delete property");
            }
        },
        onError: () => toast.error("Something went wrong"),
    });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">All Properties</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {isLoading ? "Loading..." : `${properties.length} properties on the platform`}
                </p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Property</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Location</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Landlord</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading && Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <div className="h-4 bg-muted animate-pulse rounded w-20" />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {!isLoading && properties.map((property) => (
                                <React.Fragment key={property.id}>
                                    <tr
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Building2 className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="font-medium line-clamp-1 max-w-45">
                                                    {property.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                {property.location}, {property.city}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary w-fit">
                                                <Tag className="w-3 h-3" />
                                                {property.category.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-primary">
                                            ${property.price.toLocaleString()}/mo
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">
                                            <div>{property.landlord.name}</div>
                                            <div className="text-muted-foreground/70">{property.landlord.email}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                property.isAvailable
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}>
                                                {property.isAvailable ? "Available" : "Unavailable"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* View Details */}
                                                <Link
                                                    href={`/properties/${property.id}`}
                                                    className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                                                    title="View property details"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => setConfirmDeleteId(
                                                        confirmDeleteId === property.id ? null : property.id
                                                    )}
                                                    disabled={deleteMutation.isPending}
                                                    className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
                                                    title="Delete property"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Inline Delete Confirm Row */}
                                    {confirmDeleteId === property.id && (
                                        <tr className="bg-destructive/5">
                                            <td colSpan={7} className="px-4 py-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="text-sm text-destructive flex items-center gap-2">
                                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                                        Delete <span className="font-semibold">{property.title}</span>? This cannot be undone.
                                                    </p>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => deleteMutation.mutate(property.id)}
                                                            disabled={deleteMutation.isPending}
                                                            className="text-xs px-3 py-1.5 rounded-lg bg-destructive text-white hover:bg-destructive/90 transition-colors cursor-pointer disabled:opacity-50"
                                                        >
                                                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    {isError && (
                        <div className="text-center py-10 text-destructive text-sm">
                            Failed to load properties. Please refresh.
                        </div>
                    )}
                    {!isLoading && !isError && properties.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground text-sm">
                            No properties found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}