"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteCategory } from "../../_actions/Adminactions";

export default function DeleteCategoryButton({
    categoryId,
    categoryName,
}: {
    categoryId: string;
    categoryName: string;
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Delete "${categoryName}"? This cannot be undone.`)) return;
        setLoading(true);
        try {
            const res = await deleteCategory(categoryId);
            if (res.success) {
                toast.success("Category deleted successfully!");
                router.refresh();
            } else {
                toast.error(res.message || "Failed to delete category");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
            aria-label={`Delete ${categoryName}`}
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}