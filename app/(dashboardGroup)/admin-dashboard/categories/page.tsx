"use client";

import { ICategory } from "@/lib/type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tag, Trash2, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createCategory, deleteCategory, getCategories } from "../../_actions/Adminactions";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
});

type FormValues = z.infer<typeof schema>;

export default function AdminCategoriesPage() {
    const queryClient = useQueryClient();
    const [confirmId, setConfirmId] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-categories"],
        queryFn: async () => {
            const res = await getCategories();
            return res?.data as ICategory[];
        },
    });

    const categories = data || [];

    const createMutation = useMutation({
        mutationFn: (name: string) => createCategory(name),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Category created successfully!");
                reset();
                queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            } else {
                toast.error(res.message || "Failed to create category");
            }
        },
        onError: () => toast.error("Something went wrong"),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Category deleted!");
                setConfirmId(null);
                queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            } else {
                toast.error(res.message || "Failed to delete");
            }
        },
        onError: () => toast.error("Something went wrong"),
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values.name);
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Categories</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage property categories</p>
            </div>

            {/* Create Form */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-foreground">Create New Category</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex flex-col gap-1.5">
                        <Input
                            {...register("name")}
                            placeholder="e.g. Apartment, Villa, Studio..."
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">{errors.name.message}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="cursor-pointer gap-2 shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        {createMutation.isPending ? "Creating..." : "Create Category"}
                    </Button>
                </form>
            </div>

            {/* Categories List */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-muted/50">
                    <p className="text-sm font-medium text-foreground">
                        {isLoading ? "Loading..." : `${categories.length} Categories`}
                    </p>
                </div>

                {isLoading && (
                    <div className="flex flex-col divide-y divide-border">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3">
                                <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <div className="h-3.5 w-24 bg-muted animate-pulse rounded" />
                                    <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="text-center py-10 text-destructive text-sm">
                        Failed to load categories. Please refresh.
                    </div>
                )}

                {!isLoading && !isError && (
                    <div className="divide-y divide-border">
                        {categories.map((category) => (
                            <div key={category.id} className="flex flex-col">
                                <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Tag className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{category.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Created {new Date(category.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setConfirmId(
                                            confirmId === category.id ? null : category.id
                                        )}
                                        disabled={deleteMutation.isPending}
                                        className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
                                        aria-label={`Delete ${category.name}`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Inline Confirm Row */}
                                {confirmId === category.id && (
                                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-destructive/5 border-t border-destructive/20">
                                        <div className="flex items-center gap-2 text-sm text-destructive">
                                            <AlertTriangle className="w-4 h-4 shrink-0" />
                                            Delete <span className="font-semibold">{category.name}</span>? This cannot be undone.
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => setConfirmId(null)}
                                                className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => deleteMutation.mutate(category.id)}
                                                disabled={deleteMutation.isPending}
                                                className="text-xs px-3 py-1.5 rounded-lg bg-destructive text-white hover:bg-destructive/90 transition-colors cursor-pointer disabled:opacity-50"
                                            >
                                                {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground text-sm">
                                No categories yet. Create one above.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}