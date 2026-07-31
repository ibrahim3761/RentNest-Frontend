// "use client";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { IRentalRequest } from "@/lib/type";
// import { Building2, FileText, CheckCircle, XCircle, MapPin, User, Calendar, CheckCircle2 } from "lucide-react";
// import { toast } from "sonner";
// import Link from "next/link";
// import { getLandlordRequests, updateRentalRequestStatus } from "../_actions/landlordActions";

// const PLACEHOLDER = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop";

// const statusColors: Record<string, string> = {
//   PENDING: "bg-yellow-100 text-yellow-700",
//   APPROVED: "bg-blue-100 text-blue-700",
//   REJECTED: "bg-red-100 text-red-700",
//   ACTIVE: "bg-green-100 text-green-700",
//   COMPLETED: "bg-gray-100 text-gray-700",
// };

// export default function LandlordDashboardPage() {
//   const queryClient = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ["landlord-requests"],
//     queryFn: async () => {
//       const res = await getLandlordRequests();
//       return res?.data as IRentalRequest[];
//     },
//   });

//   const requests = data || [];
//   const pendingCount = requests.filter((r) => r.status === "PENDING").length;
//   const activeCount = requests.filter((r) => r.status === "ACTIVE").length;
//   const completedCount = requests.filter((r) => r.status === "COMPLETED").length;

//   const updateMutation = useMutation({
//     mutationFn: ({ id, status }: { id: string; status: string }) =>
//       updateRentalRequestStatus(id, status),
//     onSuccess: (res) => {
//       if (res.success) {
//         toast.success("Request updated successfully!");
//         queryClient.invalidateQueries({ queryKey: ["landlord-requests"] });
//       } else {
//         toast.error(res.message || "Failed to update request");
//       }
//     },
//     onError: () => toast.error("Something went wrong"),
//   });

//   return (
//     <div className="flex flex-col gap-8">
//       <div>
//         <h1 className="text-2xl font-bold text-foreground">Landlord Overview</h1>
//         <p className="text-muted-foreground text-sm mt-1">Manage your rental requests</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
//         {[
//           { label: "Pending Requests", value: pendingCount, icon: FileText, color: "bg-yellow-50 text-yellow-600" },
//           { label: "Active Rentals", value: activeCount, icon: CheckCircle, color: "bg-green-50 text-green-600" },
//           { label: "Completed", value: completedCount, icon: Building2, color: "bg-gray-50 text-gray-600" },
//         ].map((stat) => {
//           const Icon = stat.icon;
//           return (
//             <div key={stat.label} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
//               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
//                 <Icon className="w-5 h-5" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-foreground">{isLoading ? "—" : stat.value}</p>
//                 <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Rental Requests */}
//       <div className="flex flex-col gap-4">
//         <h2 className="text-lg font-semibold text-foreground">All Rental Requests</h2>

//         {isLoading && (
//           <div className="flex flex-col gap-3">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />
//             ))}
//           </div>
//         )}

//         {!isLoading && requests.length === 0 && (
//           <div className="text-center py-16 text-muted-foreground text-sm bg-card border border-border rounded-xl">
//             No rental requests yet.
//           </div>
//         )}

//         {!isLoading && requests.length > 0 && (
//           <div className="flex flex-col gap-3">
//             {requests.map((request) => {
//               const image = request.property.images && request.property.images.length > 0
//                 ? request.property.images[0]
//                 : PLACEHOLDER;

//               return (
//                 <div
//                   key={request.id}
//                   className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4"
//                 >
//                   {/* Property Image */}
//                   <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <img src={image} alt={request.property.title} className="w-full h-full object-cover" />
//                   </div>

//                   {/* Info */}
//                   <div className="flex-1 flex flex-col gap-2 min-w-0">
//                     <div className="flex items-start justify-between gap-2 flex-wrap">
//                       <div>
//                         <Link
//                           href={`/properties/${request.property.id}`}
//                           className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
//                         >
//                           {request.property.title}
//                         </Link>
//                         <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
//                           <MapPin className="w-3 h-3" />
//                           {request.property.location}, {request.property.city}
//                         </p>
//                       </div>
//                       <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusColors[request.status]}`}>
//                         {request.status}
//                       </span>
//                     </div>

//                     <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
//                       <span className="flex items-center gap-1">
//                         <User className="w-3 h-3" />
//                         {request.tenant.name}
//                       </span>
//                       <span className="text-muted-foreground/50">•</span>
//                       <span>{request.tenant.email}</span>
//                       {request.moveInDate && (
//                         <>
//                           <span className="text-muted-foreground/50">•</span>
//                           <span className="flex items-center gap-1">
//                             <Calendar className="w-3 h-3" />
//                             {new Date(request.moveInDate).toLocaleDateString()}
//                           </span>
//                         </>
//                       )}
//                     </div>

//                     {request.message && (
//                       <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg line-clamp-2">
//                         &quot;{request.message}&quot;
//                       </p>
//                     )}

//                     {/* Actions — depend on current status */}
//                     {request.status === "PENDING" && (
//                       <div className="flex items-center gap-2 pt-1">
//                         <button
//                           onClick={() => updateMutation.mutate({ id: request.id, status: "APPROVED" })}
//                           disabled={updateMutation.isPending}
//                           className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors cursor-pointer disabled:opacity-50"
//                         >
//                           <CheckCircle className="w-3.5 h-3.5" />
//                           Approve
//                         </button>
//                         <button
//                           onClick={() => updateMutation.mutate({ id: request.id, status: "REJECTED" })}
//                           disabled={updateMutation.isPending}
//                           className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-pointer disabled:opacity-50"
//                         >
//                           <XCircle className="w-3.5 h-3.5" />
//                           Reject
//                         </button>
//                       </div>
//                     )}

//                     {request.status === "APPROVED" && (
//                       <div className="flex flex-col gap-1.5 pt-1">
//                         <p className="text-[11px] text-muted-foreground">
//                           Waiting on tenant payment to activate. You can still reject if needed.
//                         </p>

//                       </div>
//                     )}

//                     {request.status === "ACTIVE" && (
//                       <div className="flex items-center gap-2 pt-1">
//                         <button
//                           onClick={() => updateMutation.mutate({ id: request.id, status: "COMPLETED" })}
//                           disabled={updateMutation.isPending}
//                           className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
//                         >
//                           <CheckCircle2 className="w-3.5 h-3.5" />
//                           Mark as Completed
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }