"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, Menu as MenuIcon } from "lucide-react";
import { logout } from "@/service/logout";
import { NavbarProps } from "@/lib/type";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar({ user }: NavbarProps) {
    const router = useRouter();

    const handleUserMenuAction = async (action: string) => {
        if (action === "dashboard") {
            const role = user.data?.role;
            if (role === "ADMIN") {
                router.push("/admin-dashboard");
            } else if (role === "TENANT") {
                router.push("/dashboard");
            } else if (role === "LANDLORD") {
                router.push("/landlord-dashboard");
            } else {
                router.push("/dashboard");
            }
            return;
        }

        if (action === "logout") {
            await logout();
            toast.success("User Logged Out Successfully!");
            router.push("/login");
        }
    };

    const navItems = [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about-us" },
        { label: "Properties", href: "/properties" },
    ];

    const ghostIconButtonClasses =
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10";

    const initials =
        user.data?.name
            ?.split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "U";

    return (
        <nav className="border-b border-border bg-background">
            <div className="px-4 sm:px-6 lg:px-8">
                {/* 3-column grid: logo | centered links | actions */}
                <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 gap-4">

                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <span className="text-2xl font-bold text-primary">
                            RentNest
                        </span>
                    </Link>

                    {/* Desktop Nav Links — truly centered via grid col */}
                    <div className="hidden md:flex md:items-center md:justify-center md:gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side: User Auth State + Mobile Menu */}
                    <div className="flex items-center justify-end gap-4">
                        {user.success ? (
                            <>
                                {/* Desktop User Dropdown */}
                                <div className="hidden md:block">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="relative h-9 w-9 rounded-full ring-1 ring-border transition-shadow hover:ring-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage
                                                    src={user.data?.avatarUrl ?? undefined}
                                                    alt={user.data?.name ?? "User"}
                                                />
                                                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="w-64 p-1">
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel className="font-normal">
                                                    <div className="flex items-center gap-3 px-1 py-1.5">
                                                        <Avatar className="h-9 w-9 shrink-0">
                                                            <AvatarImage
                                                                src={user.data?.avatarUrl ?? undefined}
                                                                alt={user.data?.name ?? "User"}
                                                            />
                                                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                                {initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex min-w-0 flex-col">
                                                            <p className="truncate text-sm font-medium leading-none">
                                                                {user.data?.name}
                                                            </p>
                                                            <p className="mt-1 truncate text-xs text-muted-foreground">
                                                                {user.data?.email}
                                                            </p>
                                                            <span className="mt-1.5 inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                                                                {user.data?.role}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </DropdownMenuLabel>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => handleUserMenuAction("dashboard")}
                                                >
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    Dashboard
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                variant="destructive"
                                                className="cursor-pointer"
                                                onClick={() => handleUserMenuAction("logout")}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Logout
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Mobile Menu Trigger */}
                                <div className="md:hidden">
                                    <Sheet>
                                        <SheetTrigger className={ghostIconButtonClasses}>
                                            <MenuIcon className="h-6 w-6" />
                                            <span className="sr-only">Toggle menu</span>
                                        </SheetTrigger>

                                        <SheetContent side="right" className="w-70 sm:w-87.5">
                                            <div className="flex flex-col gap-6 mt-6">
                                                {/* Mobile User Info */}
                                                <div className="flex items-center gap-3 pb-4 border-b">
                                                    <Avatar className="h-10 w-10 shrink-0">
                                                        <AvatarImage
                                                            src={user.data?.avatarUrl ?? undefined}
                                                            alt={user.data?.name ?? "User"}
                                                        />
                                                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                            {initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex min-w-0 flex-col gap-1">
                                                        <p className="truncate text-sm font-medium">
                                                            {user.data?.name}
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {user.data?.email}
                                                        </p>
                                                        <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                                                            {user.data?.role}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Mobile Nav Links */}
                                                <div className="flex flex-col gap-4">
                                                    {navItems.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className="text-foreground hover:text-primary transition-colors text-base font-medium"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </div>

                                                {/* Mobile Actions */}
                                                <div className="flex flex-col gap-2 pt-4 border-t">
                                                    <Button
                                                        variant="outline"
                                                        className="justify-start w-full"
                                                        onClick={() => handleUserMenuAction("dashboard")}
                                                    >
                                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                                        Dashboard
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="justify-start w-full"
                                                        onClick={() => handleUserMenuAction("logout")}
                                                    >
                                                        <LogOut className="w-4 h-4 mr-2" />
                                                        Log out
                                                    </Button>
                                                </div>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button>Login</Button>
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}