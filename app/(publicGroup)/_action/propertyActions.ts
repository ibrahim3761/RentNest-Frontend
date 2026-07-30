"use server";

import { cookies } from "next/headers";
import { IRentalRequestInput } from "@/lib/type";

const API = process.env.BACKEND_API_URL;

export async function getProperties(params?: {
  search?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.city) query.set("city", params.city);
  if (params?.minPrice) query.set("minPrice", params.minPrice);
  if (params?.maxPrice) query.set("maxPrice", params.maxPrice);
  if (params?.page) query.set("page", params.page);

  const res = await fetch(`${API}/api/properties?${query.toString()}`, {
    next: {
      revalidate: 300, // 5 minutes
      tags: ["properties"],
    },
  });
  return res.json();
}

export async function getPropertyById(id: string) {
  const res = await fetch(`${API}/api/properties/${id}`, {
    next: {
      revalidate: 300, // 5 minutes
      tags: ["properties"],
    },
  });
  return res.json();
}

export async function createRentalRequest(input: IRentalRequestInput) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API}/api/rentals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
  return res.json();
}
