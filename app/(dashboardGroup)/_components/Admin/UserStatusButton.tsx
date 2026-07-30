"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserStatus } from "../../_actions/Adminactions";

export default function UserStatusButton({
    userId,
    currentStatus,
}: {
    userId: string;
    currentStatus: string;
}) {
    const queryClient = useQueryClient();
    const isBanned = currentStatus === "BANNED";

    const mutation = useMutation({
        mutationFn: () => updateUserStatus(userId, isBanned ? "ACTIVE" : "BANNED"),
        onSuccess: (res) => {
            if (res.success) {
                toast.success(`User ${isBanned ? "unbanned" : "banned"} successfully`);
                queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            } else {
                toast.error(res.message || "Failed to update status");
            }
        },
        onError: () => toast.error("Something went wrong"),
    });

    return (
        <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                isBanned
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
        >
            {mutation.isPending ? "..." : isBanned ? "Unban" : "Ban"}
        </button>
    );
}