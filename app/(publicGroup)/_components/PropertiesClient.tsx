"use client";

import { IProperty } from "@/lib/type";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PropertiesClientProps {
  properties: IProperty[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function PropertiesClient({
  properties,
  meta,
}: PropertiesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("page", "1");
    router.push(`/properties?${params.toString()}`);
  }, [search, city, minPrice, maxPrice, router]);

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/properties");
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/properties?${params.toString()}`);
  };

  const hasFilters = search || city || minPrice || maxPrice;

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search by title or location..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (e.g. Dhaka)"
            className="flex-1"
          />
          <Input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min price"
            type="number"
            className="flex-1"
          />
          <Input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price"
            type="number"
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button
              onClick={applyFilters}
              className="flex-1 sm:flex-none cursor-pointer"
            >
              Search
            </Button>
            {hasFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="cursor-pointer"
                aria-label="Clear filters"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {meta.total === 0
            ? "No properties found"
            : `Showing ${properties.length} of ${meta.total} properties`}
        </p>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Search className="w-12 h-12 text-muted-foreground/40" />
          <p className="text-lg font-semibold text-foreground">
            No properties found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="mt-2 cursor-pointer"
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() => goToPage(meta.page - 1)}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: meta.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  meta.page === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.totalPages}
            onClick={() => goToPage(meta.page + 1)}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}