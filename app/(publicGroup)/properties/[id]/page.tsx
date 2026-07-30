import { getPropertyById } from "@/app/(publicGroup)/_action/propertyActions";
import { getMe } from "@/service/getMe";
import { IReview } from "@/lib/type";
import { notFound } from "next/navigation";
import {
  Bath,
  Bed,
  Building2,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Star,
  Tag,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RentalRequestForm from "../../_components/RentalRequestForm";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop";

interface SinglePropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function SinglePropertyPage({
  params,
}: SinglePropertyPageProps) {
  const { id } = await params;
  const [propertyRes, user] = await Promise.all([
    getPropertyById(id),
    getMe(),
  ]);

  if (!propertyRes?.success || !propertyRes?.data) {
    notFound();
  }

  const property = propertyRes.data;
  const images: string[] =
    property.images && property.images.length > 0
      ? property.images
      : [PLACEHOLDER];

  const isTenant = user?.success && user.data.role === "TENANT";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Properties
      </Link>

      <div className="flex flex-col gap-8">
        {/* Image Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full ${
                property.isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {property.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img: string, i: number) => (
                <div
                  key={i}
                  className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Main Details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Title + Price */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  <Tag className="w-3.5 h-3.5" />
                  {property.category.name}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {property._count.reviews} reviews
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                {property.location}, {property.city}
              </div>
              <div className="text-3xl font-bold text-primary">
                ${property.price.toLocaleString()}
                <span className="text-muted-foreground font-normal text-base">
                  /month
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                { icon: Ruler, label: "Area", value: `${property.area} sqft` },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border text-center"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                Description
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Landlord */}
            <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Landlord
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  {property.landlord.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={property.landlord.avatarUrl}
                      alt={property.landlord.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary font-semibold">
                      {property.landlord.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-medium">{property.landlord.name}</p>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    {property.landlord.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    {property.landlord.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {property.reviews && property.reviews.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Reviews ({property._count.reviews})
                </h2>
                <div className="flex flex-col gap-3">
                  {property.reviews.map((review: IReview) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-xl border border-border bg-card flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {review.tenant.name}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i: number) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Rental Request Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {isTenant && property.isAvailable ? (
                <RentalRequestForm propertyId={property.id} />
              ) : !user?.success ? (
                <div className="p-5 rounded-xl border border-border bg-card flex flex-col gap-3 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto" />
                  <p className="text-sm font-medium text-foreground">
                    Interested in this property?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Login as a tenant to send a rental request.
                  </p>
                  <Link href="/login">
                    <Button className="w-full cursor-pointer">
                      Login to Request
                    </Button>
                  </Link>
                </div>
              ) : !property.isAvailable ? (
                <div className="p-5 rounded-xl border border-border bg-card flex flex-col gap-3 text-center">
                  <p className="text-sm font-medium text-destructive">
                    This property is currently unavailable.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}