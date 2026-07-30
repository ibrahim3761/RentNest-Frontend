import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProperties } from "../_action/propertyActions";
import PropertyCard from "./PropertyCard";
import { IProperty } from "@/lib/type";

export default async function FeaturedProperties() {
    const propertiesRes = await getProperties();

    const properties: IProperty[] = (propertiesRes?.data ?? []).slice(0, 4);

    if (!properties.length) {
        return null;
    }

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                            Featured Properties
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            Discover our latest rental properties.
                        </p>
                    </div>

                    {/* Desktop Button */}
                    <Link href="/properties" className="hidden sm:inline-flex">
                        <Button className="cursor-pointer">
                            See More
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Properties Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {properties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                        />
                    ))}
                </div>

                {/* Mobile Button */}
                <div className="mt-8 flex justify-center sm:hidden">
                    <Link href="/properties">
                        <Button>
                            See More Properties
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}