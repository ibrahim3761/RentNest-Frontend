"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const API = process.env.BACKEND_API_URL;

async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getLandlordRequests() {
    const res = await fetch(`${API}/api/landlord/requests`, {
        headers: await getAuthHeaders(),
        next: { revalidate: 60, tags: ["landlord-requests"] },
    });
    return res.json();
}

export async function updateRentalRequestStatus(id: string, status: string) {
    const res = await fetch(`${API}/api/landlord/requests/${id}`, {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (result.success) {
        revalidateTag("landlord-requests",{
            expire:0
        });
    }
    return result;
}

export async function createProperty(payload: {
    title: string;
    description: string;
    location: string;
    city: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
    categoryId: string;
}) {
    const res = await fetch(`${API}/api/landlord/properties`, {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.success) {
        revalidateTag("properties",{
            expire:0
        });
        revalidateTag("landlord-properties",{
            expire:0
        });
    }
    return result;
}

export async function updateProperty(
    id: string,
    payload: Partial<{
        title: string;
        description: string;
        location: string;
        city: string;
        price: number;
        bedrooms: number;
        bathrooms: number;
        area: number;
        images: string[];
        categoryId: string;
        isAvailable: boolean;
    }>
) {
    const res = await fetch(`${API}/api/landlord/properties/${id}`, {
        method: "PUT",
        headers: await getAuthHeaders(),
        body: JSON.stringify(payload),
    });

     console.log("Status:", res.status);

    const result = await res.json();
    if (result.success) {
        revalidateTag("properties",{
            expire:0
        });
        revalidateTag("landlord-properties",{
            expire:0
        });
    }

    
    return result;
}

export async function deleteProperty(id: string) {
    const res = await fetch(`${API}/api/landlord/properties/${id}`, {
        method: "DELETE",
        headers: await getAuthHeaders(),
    });
    const result = await res.json();
    if (result.success) {
        revalidateTag("properties",{
            expire:0
        });
        revalidateTag("landlord-properties",{
            expire:0
        });
    }
    return result;
}