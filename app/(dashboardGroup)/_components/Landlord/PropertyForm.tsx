"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { ICategory, IProperty } from "@/lib/type";

export const propertySchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(2, "Location is required"),
    city: z.string().min(2, "City is required"),
    price: z.coerce.number().positive("Price must be positive"),
    bedrooms: z.coerce.number().int().min(1, "At least 1 bedroom"),
    bathrooms: z.coerce.number().int().min(1, "At least 1 bathroom"),
    area: z.coerce.number().positive("Area must be positive"),
    categoryId: z.string().min(1, "Please select a category"),
    images: z.string().optional(),
});

export type PropertyFormInput = z.input<typeof propertySchema>;
export type PropertyFormValues = z.output<typeof propertySchema>;

interface PropertyFormProps {
    categories: ICategory[];
    editingProperty: IProperty | null;
    isPending: boolean;
    onSubmit: (values: PropertyFormValues) => void;
    onClose: () => void;
}

export default function PropertyForm({
    categories,
    editingProperty,
    isPending,
    onSubmit,
    onClose,
}: PropertyFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PropertyFormInput, IProperty, PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        defaultValues: editingProperty
            ? {
                  title: editingProperty.title,
                  description: editingProperty.description,
                  location: editingProperty.location,
                  city: editingProperty.city,
                  price: editingProperty.price,
                  bedrooms: editingProperty.bedrooms,
                  bathrooms: editingProperty.bathrooms,
                  area: editingProperty.area,
                  categoryId: editingProperty.categoryId,
                  images: editingProperty.images.join(", "),
              }
            : undefined,
    });

    return (
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">
                    {editingProperty ? "Edit Property" : "Create New Property"}
                </h2>
                <button onClick={onClose} className="p-1 rounded-md hover:bg-accent cursor-pointer">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Title <span className="text-destructive">*</span></label>
                    <Input {...register("title")} placeholder="e.g. Modern 2 Bedroom Apartment" />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Description <span className="text-destructive">*</span></label>
                    <textarea
                        {...register("description")}
                        rows={3}
                        placeholder="Describe the property..."
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-colors"
                    />
                    {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>

                {/* Location + City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">Location <span className="text-destructive">*</span></label>
                        <Input {...register("location")} placeholder="e.g. Dhanmondi" />
                        {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">City <span className="text-destructive">*</span></label>
                        <Input {...register("city")} placeholder="e.g. Dhaka" />
                        {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                    </div>
                </div>

                {/* Price + Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">Price/month ($) <span className="text-destructive">*</span></label>
                        <Input {...register("price")} type="number" placeholder="e.g. 25000" />
                        {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">Area (sqft) <span className="text-destructive">*</span></label>
                        <Input {...register("area")} type="number" placeholder="e.g. 1200" />
                        {errors.area && <p className="text-xs text-destructive">{errors.area.message}</p>}
                    </div>
                </div>

                {/* Bedrooms + Bathrooms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">Bedrooms <span className="text-destructive">*</span></label>
                        <Input {...register("bedrooms")} type="number" min={1} placeholder="e.g. 2" />
                        {errors.bedrooms && <p className="text-xs text-destructive">{errors.bedrooms.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">Bathrooms <span className="text-destructive">*</span></label>
                        <Input {...register("bathrooms")} type="number" min={1} placeholder="e.g. 2" />
                        {errors.bathrooms && <p className="text-xs text-destructive">{errors.bathrooms.message}</p>}
                    </div>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Category <span className="text-destructive">*</span></label>
                    <select
                        {...register("categoryId")}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
                </div>

                {/* Images */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">
                        Image URLs
                        <span className="text-muted-foreground font-normal text-xs ml-1">(optional, comma separated)</span>
                    </label>
                    <Input {...register("images")} placeholder="https://..., https://..." />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1 cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending} className="flex-1 cursor-pointer">
                        {isPending
                            ? editingProperty ? "Updating..." : "Creating..."
                            : editingProperty ? "Update Property" : "Create Property"}
                    </Button>
                </div>
            </form>
        </div>
    );
}