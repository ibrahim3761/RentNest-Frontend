"use server";

import { revalidateTag } from "next/cache";
import { isAccessTokenExist } from "@/service/refreshToken";

const API = process.env.BACKEND_API_URL;

async function getAuthHeaders() {
    const accessToken = await isAccessTokenExist();

    return {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
    };
}

export async function getAllUsers() {
    const res = await fetch(`${API}/api/admin/users`, {
        headers: await getAuthHeaders(),
        next: { revalidate: 60, tags: ["admin-users"] },
    });
    return res.json();
}

export async function updateUserStatus(userId: string, status: string) {
    const res = await fetch(`${API}/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (result.success) {
        revalidateTag("admin-users",{
            expire:0
        });
    }
    return result;
}

export async function getAdminProperties() {
    const res = await fetch(`${API}/api/admin/properties`, {
        headers: await getAuthHeaders(),
        next: { revalidate: 60, tags: ["admin-properties"] },
    });
    return res.json();
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

export async function getAdminRentals() {
    const res = await fetch(`${API}/api/admin/rentals`, {
        headers: await getAuthHeaders(),
        next: { revalidate: 60, tags: ["admin-rentals"] },
    });
    return res.json();
}

export async function getAllPayments() {
    const res = await fetch(`${API}/api/payments`, {
        headers: await getAuthHeaders(),
        next: { revalidate: 60, tags: ["admin-payments"] },
    });
    return res.json();
}

export async function getPaymentById(id: string) {
    const res = await fetch(`${API}/api/payments/${id}`, {
        headers: await getAuthHeaders(),
        next: { revalidate: 60, tags: [`payment-${id}`] },
    });
    return res.json();
}

export async function getCategories() {
    const res = await fetch(`${API}/api/categories`, {
        next: { revalidate: 60, tags: ["categories"] },
    });
    return res.json();
}

export async function createCategory(name: string) {
    const res = await fetch(`${API}/api/categories`, {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ name }),
    });
    const result = await res.json();
    if (result.success) {
        revalidateTag("categories",{
            expire:0
        });
    }
    return result;
}

export async function deleteCategory(id: string) {
    const res = await fetch(`${API}/api/categories/${id}`, {
        method: "DELETE",
        headers: await getAuthHeaders(),
    });
    const result = await res.json();
    if (result.success) {
        revalidateTag("categories",{
            expire:0
        });
    }
    return result;
}