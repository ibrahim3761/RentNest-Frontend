"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Plus } from "lucide-react";
import { createCategory } from "../../_actions/Adminactions";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
});

type FormValues = z.infer<typeof schema>;

export default function CreateCategoryForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            const res = await createCategory(values.name);
            if (res.success) {
                toast.success("Category created successfully!");
                reset();
                router.refresh();
            } else {
                toast.error(res.message || "Failed to create category");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">Create New Category</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                    <Input
                        {...register("name")}
                        placeholder="e.g. Apartment, Villa, Studio..."
                        className="flex-1"
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                </div>
                <Button type="submit" disabled={loading} className="cursor-pointer gap-2 shrink-0">
                    <Plus className="w-4 h-4" />
                    {loading ? "Creating..." : "Create Category"}
                </Button>
            </form>
        </div>
    );
}