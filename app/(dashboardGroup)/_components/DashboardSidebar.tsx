"use client";

import { logout } from "@/service/logout";
import { IUser } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
    Building2,
    FileText,
    Home,
    LayoutDashboard,
    LogOut,
    LayoutList,
    Menu,
    Users,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const tenantLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Rentals", href: "/dashboard/rentals", icon: FileText },
];

const landlordLinks = [
    { label: "Overview", href: "/landlord-dashboard", icon: LayoutDashboard },
    { label: "My Properties", href: "/landlord-dashboard/properties", icon: Building2 },
    { label: "Rental Requests", href: "/landlord-dashboard/requests", icon: FileText },
];

const adminLinks = [
    { label: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
    { label: "Manage Users", href: "/admin-dashboard/users", icon: Users },
    { label: "All Properties", href: "/admin-dashboard/properties", icon: Building2 },
    { label: "All Rentals", href: "/admin-dashboard/rentals", icon: FileText },
    { label: "Categories", href: "/admin-dashboard/categories", icon: LayoutList },
];

const getLinks = (role: string) => {
    if (role === "LANDLORD") return landlordLinks;
    if (role === "ADMIN") return adminLinks;
    return tenantLinks;
};

const getRoleColor = (role: string) => {
    if (role === "LANDLORD") return "bg-blue-100 text-blue-700";
    if (role === "ADMIN") return "bg-red-100 text-red-700";
    return "bg-green-100 text-green-700";
};

function SidebarInner({
    user,
    onClose,
}: {
    user: IUser;
    onClose?: () => void;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const links = getLinks(user.data.role);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully!");
        router.push("/login");
    };

    return (
        <div className="flex flex-col h-full bg-card">
            {/* Logo */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <Link
                    href="/"
                    onClick={onClose}
                    className="flex items-center gap-2"
                >
                    <Building2 className="w-6 h-6 text-primary" />
                    <span className="text-lg font-bold text-primary">RentNest</span>
                </Link>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-md hover:bg-accent transition-colors cursor-pointer"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* User Info */}
            <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {user.data.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={user.data.avatarUrl}
                                alt={user.data.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-primary font-semibold text-sm">
                                {user.data.name?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-sm font-medium truncate">{user.data.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.data.email}</p>
                        <span className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full w-fit mt-1",
                            getRoleColor(user.data.role)
                        )}>
                            {user.data.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    Navigation
                </p>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-border flex flex-col gap-1">
                <Link
                    href="/"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <Home className="w-4 h-4 shrink-0" />
                    Back to Home
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left cursor-pointer"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Log out
                </button>
            </div>
        </div>
    );
}

export default function DashboardSidebar({ user }: { user: IUser }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border h-screen sticky top-0">
                <SidebarInner user={user} />
            </aside>

            {/* Mobile Top Bar */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card sticky top-0 z-40">
                <Link href="/" className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="text-base font-bold text-primary">RentNest</span>
                </Link>
                <button
                    onClick={() => setOpen(true)}
                    className="p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile Overlay */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div
                className={cn(
                    "lg:hidden fixed top-0 left-0 h-full w-72 z-50 transition-transform duration-300 ease-in-out border-r border-border",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <SidebarInner user={user} onClose={() => setOpen(false)} />
            </div>
        </>
    );
}