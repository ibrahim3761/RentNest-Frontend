"use client";

import { createRentalRequest } from "@/app/(publicGroup)/_action/propertyActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";

const rentalSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message cannot exceed 500 characters"),
  moveInDate: z.string().optional(),
});

type RentalFormValues = z.infer<typeof rentalSchema>;

export default function RentalRequestForm({
  propertyId,
}: {
  propertyId: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RentalFormValues>({
    resolver: zodResolver(rentalSchema),
  });

  const onSubmit = async (values: RentalFormValues) => {
    setSubmitting(true);
    try {
      const res = await createRentalRequest({
        propertyId,
        message: values.message,
        moveInDate: values.moveInDate || undefined,
      });
      if (res.success) {
        toast.success("Rental request submitted successfully!");
        reset();
        router.push("/dashboard");
      } else {
        toast.error(res.message || "Failed to submit request");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 rounded-xl border border-border bg-card flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Request to Rent</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            {...register("message")}
            rows={4}
            placeholder="Tell the landlord about yourself and why you want to rent..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-colors"
          />
          {errors.message && (
            <p className="text-xs text-destructive">{errors.message.message}</p>
          )}
        </div>

        {/* Move-in Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Move-in Date{" "}
            <span className="text-muted-foreground font-normal text-xs">
              (optional)
            </span>
          </label>
          <Input
            type="date"
            {...register("moveInDate")}
            min={new Date().toISOString().split("T")[0]}
            className="text-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer"
          size="lg"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
}