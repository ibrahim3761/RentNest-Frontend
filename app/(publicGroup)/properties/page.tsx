import { getProperties } from "@/app/(publicGroup)/_action/propertyActions";
import { Building2 } from "lucide-react";
import PropertiesClient from "../_components/PropertiesClient";

interface PropertiesPageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const params = await searchParams;
  const propertiesRes = await getProperties(params);

  const properties = propertiesRes?.data || [];
  const meta = propertiesRes?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            All Properties
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          Browse available rentals and find your perfect home.
        </p>
      </div>
      <PropertiesClient properties={properties} meta={meta} />
    </div>
  );
}