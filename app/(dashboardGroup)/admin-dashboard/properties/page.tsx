
import { IProperty } from "@/lib/type";
import { Building2, MapPin, Tag } from "lucide-react";
import { getAdminProperties } from "../../_actions/Adminactions";

export default async function AdminPropertiesPage() {
    const res = await getAdminProperties();
    const properties: IProperty[] = res?.data || [];

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">All Properties</h1>
                <p className="text-muted-foreground text-sm mt-1">{properties.length} properties on the platform</p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Property</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Location</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Landlord</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {properties.map((property) => (
                                <tr key={property.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <Building2 className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="font-medium line-clamp-1 max-w-[180px]">{property.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                                            {property.location}, {property.city}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary w-fit">
                                            <Tag className="w-3 h-3" />
                                            {property.category.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-primary">
                                        ${property.price.toLocaleString()}/mo
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">
                                        <div>{property.landlord.name}</div>
                                        <div className="text-muted-foreground/70">{property.landlord.email}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                            property.isAvailable
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}>
                                            {property.isAvailable ? "Available" : "Unavailable"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {properties.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground text-sm">No properties found</div>
                    )}
                </div>
            </div>
        </div>
    );
}