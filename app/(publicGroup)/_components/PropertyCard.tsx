import { IProperty } from "@/lib/type";
import { Bath, Bed, MapPin, Ruler, Star, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER =
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop";

interface PropertyCardProps {
    property: IProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const image =
        property.images && property.images.length > 0
            ? property.images[0]
            : PLACEHOLDER;

    return (
        <Link href={`/properties/${property.id}`}>
            <div className="group bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                    <Image
                        src={image}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span
                        className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full z-10 ${
                            property.isAvailable
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {property.isAvailable ? "Available" : "Unavailable"}
                    </span>
                    <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground flex items-center gap-1 z-10">
                        <Tag className="w-3 h-3" />
                        {property.category.name}
                    </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
                            {property.title}
                        </h3>
                        <span className="text-primary font-bold text-sm shrink-0">
                            ${property.price.toLocaleString()}
                            <span className="text-muted-foreground font-normal text-xs">/mo</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                            {property.location}, {property.city}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3">
                        <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5" />
                            {property.bedrooms} Beds
                        </span>
                        <span className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5" />
                            {property.bathrooms} Baths
                        </span>
                        <span className="flex items-center gap-1">
                            <Ruler className="w-3.5 h-3.5" />
                            {property.area} sqft
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            {property._count.reviews}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}