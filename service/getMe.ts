"use server"

import { cookies } from "next/headers";

export const getMe = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in",
        };
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
        method: "GET",
        headers: {
            // Authorization: `${accessToken}`,
            Cookie: `accessToken=${accessToken}`,
        },

        cache : "force-cache",
        next : {
           revalidate : 60*60*24, // 1 day
           tags : ["my-profile"],
        }
    });

    const result = await res.json();

    // console.log(result);
    
    return result;
};