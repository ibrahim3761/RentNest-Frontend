// "use client";

// import { getMe } from "@/service/getMe";
// import { getProperties } from "@/app/(publicGroup)/_action/propertyActions";
// import { IProperty, ICategory } from "@/lib/type";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { useState } from "react";
// import {
//     Plus, Pencil, Trash2, X, Building2,
//     MapPin, Bed, Bath, Ruler, Tag, AlertTriangle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { getCategories } from "../../_actions/Adminactions";
// import { createProperty, deleteProperty, updateProperty } from "../../_actions/landlordActions";
// import PropertyForm, { PropertyFormValues } from "../../_components/Landlord/PropertyForm";

// const PLACEHOLDER = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop";

// export default function LandlordPropertiesPage() {
//     const queryClient = useQueryClient();
//     const [showForm, setShowForm] = useState(false);
//     const [editingProperty, setEditingProperty] = useState<IProperty | null>(null);
//     const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

//     // Fetch current user to get landlordId
//     const { data: user } = useQuery({
//         queryKey: ["me"],
//         queryFn: () => getMe(),
//     });

//     // Fetch all properties then filter by landlordId
//     const { data: allProperties, isLoading: propertiesLoading } = useQuery({
//         queryKey: ["landlord-properties"],
//         queryFn: async () => {
//             const res = await getProperties();
//             return res?.data as IProperty[];
//         },
//         enabled: !!user?.data?.id,
//     });

//     const properties = (allProperties || []).filter(
//         (p) => p.landlordId === user?.data?.id
//     );

//     // Fetch categories for dropdown
//     const { data: categoriesData } = useQuery({
//         queryKey: ["categories"],
//         queryFn: async () => {
//             const res = await getCategories();
//             return res?.data as ICategory[];
//         },
//     });
//     const categories = categoriesData || [];

//     // Create mutation
//     const createMutation = useMutation({
//         mutationFn: (values: PropertyFormValues) =>
//             createProperty({
//                 ...values,
//                 images: values.images
//                     ? values.images.split(",").map((s) => s.trim()).filter(Boolean)
//                     : [],
//             }),
//         onSuccess: (res) => {
//             if (res.success) {
//                 toast.success("Property created successfully!");
//                 setShowForm(false);
//                 queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
//             } else {
//                 toast.error(res.message || "Failed to create property");
//             }
//         },
//         onError: () => toast.error("Something went wrong"),
//     });

//     // Update mutation
//     const updateMutation = useMutation({
//         mutationFn: ({ id, values }: { id: string; values: PropertyFormValues }) =>
//             updateProperty(id, {
//                 ...values,
//                 images: values.images
//                     ? values.images.split(",").map((s) => s.trim()).filter(Boolean)
//                     : [],
//             }),
//         onSuccess: (res) => {
//             if (res.success) {
//                 toast.success("Property updated successfully!");
//                 setEditingProperty(null);
//                 setShowForm(false);
//                 queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
//             } else {
//                 toast.error(res.message || "Failed to update property");
//             }
//         },
//         onError: () => toast.error("Something went wrong"),
//     });

//     // Delete mutation
//     const deleteMutation = useMutation({
//         mutationFn: (id: string) => deleteProperty(id),
//         onSuccess: (res) => {
//             if (res.success) {
//                 toast.success("Property deleted!");
//                 setConfirmDeleteId(null);
//                 queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
//             } else {
//                 toast.error(res.message || "Failed to delete");
//             }
//         },
//         onError: () => toast.error("Something went wrong"),
//     });

//     const openEdit = (property: IProperty) => {
//         setEditingProperty(property);
//         setShowForm(true);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     const closeForm = () => {
//         setShowForm(false);
//         setEditingProperty(null);
//     };

//     const onSubmit = (values: PropertyFormValues) => {
//         if (editingProperty) {
//             updateMutation.mutate({ id: editingProperty.id, values });
//         } else {
//             createMutation.mutate(values);
//         }
//     };

//     const isPending = createMutation.isPending || updateMutation.isPending;

//     return (
//         <div className="flex flex-col gap-6">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-2xl font-bold text-foreground">My Properties</h1>
//                     <p className="text-muted-foreground text-sm mt-1">
//                         {propertiesLoading ? "Loading..." : `${properties.length} properties`}
//                     </p>
//                 </div>
//                 <Button
//                     onClick={() => {
//                         if (showForm && !editingProperty) {
//                             closeForm();
//                         } else {
//                             closeForm();
//                             setShowForm(true);
//                         }
//                     }}
//                     className="cursor-pointer gap-2"
//                 >
//                     {showForm && !editingProperty ? (
//                         <><X className="w-4 h-4" /> Cancel</>
//                     ) : (
//                         <><Plus className="w-4 h-4" /> Add Property</>
//                     )}
//                 </Button>
//             </div>

//             {/* Create / Edit Form */}
//             {showForm && (
//                 <PropertyForm
//                     categories={categories}
//                     editingProperty={editingProperty}
//                     isPending={isPending}
//                     onClose={closeForm}
//                     onSubmit={onSubmit}
//                 />
//             )}

//             {/* Properties Grid */}
//             {propertiesLoading && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {[1, 2, 3].map((i) => (
//                         <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
//                     ))}
//                 </div>
//             )}

//             {!propertiesLoading && properties.length === 0 && (
//                 <div className="text-center py-16 text-muted-foreground text-sm bg-card border border-border rounded-xl flex flex-col items-center gap-3">
//                     <Building2 className="w-10 h-10 text-muted-foreground/30" />
//                     <p>No properties yet. Add your first property above!</p>
//                 </div>
//             )}

//             {!propertiesLoading && properties.length > 0 && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {properties.map((property) => {
//                         const image = property.images && property.images.length > 0
//                             ? property.images[0]
//                             : PLACEHOLDER;

//                         return (
//                             <div key={property.id} className="flex flex-col bg-card border border-border rounded-xl overflow-hidden">
//                                 {/* Image */}
//                                 <div className="relative h-44 bg-muted overflow-hidden">
//                                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                                     <img src={image} alt={property.title} className="w-full h-full object-cover" />
//                                     <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full ${property.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                                         {property.isAvailable ? "Available" : "Unavailable"}
//                                     </span>
//                                     <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full bg-primary/90 text-primary-foreground flex items-center gap-1">
//                                         <Tag className="w-3 h-3" />
//                                         {property.category.name}
//                                     </span>
//                                 </div>

//                                 {/* Content */}
//                                 <div className="p-4 flex flex-col gap-3 flex-1">
//                                     <div className="flex items-start justify-between gap-2">
//                                         <h3 className="font-semibold text-foreground text-sm line-clamp-2">{property.title}</h3>
//                                         <span className="text-primary font-bold text-sm shrink-0">
//                                             ${property.price.toLocaleString()}<span className="text-muted-foreground font-normal text-xs">/mo</span>
//                                         </span>
//                                     </div>

//                                     <p className="text-xs text-muted-foreground flex items-center gap-1">
//                                         <MapPin className="w-3.5 h-3.5 shrink-0" />
//                                         {property.location}, {property.city}
//                                     </p>

//                                     <div className="flex items-center gap-3 text-xs text-muted-foreground">
//                                         <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.bedrooms}</span>
//                                         <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{property.bathrooms}</span>
//                                         <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" />{property.area} sqft</span>
//                                     </div>

//                                     {/* Actions */}
//                                     <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-border">
//                                         <div className="flex gap-2">
//                                             <Link href={`/properties/${property.id}`} className="flex-1">
//                                                 <Button variant="outline" size="sm" className="w-full cursor-pointer text-xs">
//                                                     View
//                                                 </Button>
//                                             </Link>
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={() => openEdit(property)}
//                                                 className="flex-1 cursor-pointer text-xs gap-1"
//                                             >
//                                                 <Pencil className="w-3 h-3" /> Edit
//                                             </Button>
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={() => setConfirmDeleteId(
//                                                     confirmDeleteId === property.id ? null : property.id
//                                                 )}
//                                                 className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
//                                             >
//                                                 <Trash2 className="w-3.5 h-3.5" />
//                                             </Button>
//                                         </div>

//                                         {/* Inline Delete Confirm */}
//                                         {confirmDeleteId === property.id && (
//                                             <div className="flex flex-col gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
//                                                 <p className="text-xs text-destructive flex items-center gap-1.5">
//                                                     <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
//                                                     Delete this property? This cannot be undone.
//                                                 </p>
//                                                 <div className="flex gap-2">
//                                                     <button
//                                                         onClick={() => setConfirmDeleteId(null)}
//                                                         className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
//                                                     >
//                                                         Cancel
//                                                     </button>
//                                                     <button
//                                                         onClick={() => deleteMutation.mutate(property.id)}
//                                                         disabled={deleteMutation.isPending}
//                                                         className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-destructive text-white hover:bg-destructive/90 transition-colors cursor-pointer disabled:opacity-50"
//                                                     >
//                                                         {deleteMutation.isPending ? "Deleting..." : "Delete"}
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// }