"use client";

import { IUserItem } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import { Building2, Users, FileText, CreditCard, ShieldCheck, ShieldOff } from "lucide-react";
import { getAdminProperties, getAdminRentals, getAllPayments, getAllUsers } from "../_actions/Adminactions";
import UserStatusButton from "../_components/Admin/UserStatusButton";

export default function AdminDashboardPage() {
    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const res = await getAllUsers();
            return res?.data as IUserItem[];
        },
    });

    const { data: properties = [] } = useQuery({
        queryKey: ["admin-properties-count"],
        queryFn: async () => {
            const res = await getAdminProperties();
            return res?.data || [];
        },
    });

    const { data: rentals = [] } = useQuery({
        queryKey: ["admin-rentals-count"],
        queryFn: async () => {
            const res = await getAdminRentals();
            return res?.data || [];
        },
    });

    const { data: payments = [] } = useQuery({
        queryKey: ["admin-payments-count"],
        queryFn: async () => {
            const res = await getAllPayments();
            return res?.data || [];
        },
    });

    const activeUsers = users.filter((u) => u.status === "ACTIVE").length;
    const bannedUsers = users.filter((u) => u.status === "BANNED").length;

    const stats = [
        { label: "Total Users", value: users.length, icon: Users, color: "bg-blue-50 text-blue-600" },
        { label: "Total Properties", value: properties.length, icon: Building2, color: "bg-green-50 text-green-600" },
        { label: "Total Rentals", value: rentals.length, icon: FileText, color: "bg-yellow-50 text-yellow-600" },
        { label: "Total Payments", value: payments.length, icon: CreditCard, color: "bg-purple-50 text-purple-600" },
    ];

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
                <p className="text-muted-foreground text-sm mt-1">Platform summary and user management</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active / Banned breakdown */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{activeUsers}</p>
                        <p className="text-xs text-muted-foreground">Active Users</p>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <ShieldOff className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{bannedUsers}</p>
                        <p className="text-xs text-muted-foreground">Banned Users</p>
                    </div>
                </div>
            </div>

            {/* Manage Users Table */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-foreground">Manage Users</h2>
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
                                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {usersLoading &&
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i}>
                                            {Array.from({ length: 5 }).map((_, j) => (
                                                <td key={j} className="px-4 py-3">
                                                    <div className="h-4 bg-muted animate-pulse rounded w-24" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                {!usersLoading &&
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        {user.avatarUrl ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                                        ) : (
                                                            <span className="text-primary font-semibold text-xs">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-medium truncate">{user.name}</span>
                                                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                    user.role === "ADMIN"
                                                        ? "bg-red-100 text-red-700"
                                                        : user.role === "LANDLORD"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                    user.status === "ACTIVE"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground text-xs">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <UserStatusButton
                                                    userId={user.id}
                                                    currentStatus={user.status}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {!usersLoading && users.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground text-sm">No users found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}