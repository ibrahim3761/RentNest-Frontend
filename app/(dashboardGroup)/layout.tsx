import DashboardSidebar from "./_components/DashboardSidebar";
import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";

export default async function DashboardGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getMe();

    if (!user?.success) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background">
            <DashboardSidebar user={user} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                {children}
            </main>
        </div>
    );
}