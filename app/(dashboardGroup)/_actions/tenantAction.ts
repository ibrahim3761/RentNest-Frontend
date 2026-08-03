"use server";

import { isAccessTokenExist } from "@/service/refreshToken";
import { ICreateReviewInput } from "@/lib/type";
import { revalidateTag } from "next/cache";

const API = process.env.BACKEND_API_URL;

async function getAuthHeaders(contentType = false) {
    const accessToken = await isAccessTokenExist();

    return {
        ...(contentType && { "Content-Type": "application/json" }),
        Cookie: `accessToken=${accessToken}`,
    };
}

export async function getTenantRentals() {
    const res = await fetch(`${API}/api/rentals`, {
        headers: await getAuthHeaders(),
        cache: "no-store",
    });

    return res.json();
}

export async function getRentalRequestById(id: string) {
    const res = await fetch(`${API}/api/rentals/${id}`, {
        headers: await getAuthHeaders(),
        next: { revalidate: 60, tags: [`tenant-rental-${id}`] },
    });

    return res.json();
}

export async function createPayment(rentalRequestId: string) {
    const res = await fetch(`${API}/api/payments/create`, {
        method: "POST",
        headers: await getAuthHeaders(true),
        body: JSON.stringify({ rentalRequestId }),
    });

    return res.json();
}

export async function createReview(input: ICreateReviewInput) {
    const res = await fetch(`${API}/api/reviews`, {
        method: "POST",
        headers: await getAuthHeaders(true),
        body: JSON.stringify(input),
    });

    if(res.status === 200) {
        // Invalidate the cache for the specific rental request to ensure fresh data
        revalidateTag(`tenant-rental-${input.rentalRequestId}`, {
            expire: 0,
        });
    }

    return res.json();
}

export async function getTenantPayments() {
    const res = await fetch(`${API}/api/payments`, {
        headers: await getAuthHeaders(),
        next: { revalidate: 60, tags: ["tenant-payments"] },
    });

    return res.json();
}

export async function getPaymentById(id: string) {
    const res = await fetch(`${API}/api/payments/${id}`, {
        headers: await getAuthHeaders(),
        next: { revalidate: 60, tags: [`tenant-payment-${id}`] },
    });

    return res.json();
}