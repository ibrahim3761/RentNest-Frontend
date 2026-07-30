
import { IRentalRequest } from "@/lib/type";
import { getAdminRentals } from "../../_actions/Adminactions";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    ACTIVE: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-100 text-gray-700",
};

export default async function AdminRentalsPage() {
    const res = await getAdminRentals();
    const rentals: IRentalRequest[] = res?.data || [];

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">All Rentals</h1>
                <p className="text-muted-foreground text-sm mt-1">{rentals.length} rental requests on the platform</p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tenant</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Property</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Move-in Date</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Requested</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {rentals.map((rental) => (
                                <tr key={rental.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{rental.tenant.name}</div>
                                        <div className="text-xs text-muted-foreground">{rental.tenant.email}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium line-clamp-1 max-w-[200px]">{rental.property.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {rental.property.location}, {rental.property.city}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[rental.status] || "bg-gray-100 text-gray-700"}`}>
                                            {rental.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">
                                        {rental.moveInDate
                                            ? new Date(rental.moveInDate).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">
                                        {new Date(rental.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {rentals.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground text-sm">No rental requests found</div>
                    )}
                </div>
            </div>
        </div>
    );
}