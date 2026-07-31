export type IUser = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    status: string;
    role: string;
    address: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    avatarUrl?: string;
  };
};

export type NavbarProps = {
  user: IUser;
};

export type ICategory = {
  id: string;
  name: string;
  createdAt: string;
};

export type ILandlord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone: string;
  address: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type IReview = {
  id: string;
  rating: number;
  comment: string;
  tenantId: string;
  propertyId: string;
  rentalRequestId: string;
  createdAt: string;
  tenant: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
};

export type IProperty = {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  isAvailable: boolean;
  landlordId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: ICategory;
  landlord: ILandlord;
  reviews?: IReview[];
  _count: {
    reviews: number;
    rentalRequests?: number;
  };
};

export type IPropertyListResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: IProperty[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type IPropertySingleResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: IProperty;
};

export type IRentalRequestInput = {
  propertyId: string;
  message?: string;
  moveInDate?: string;
};

export type IUserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone: string;
  address: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type IRentalRequest = {
  id: string;
  message: string | null;
  status: string;
  moveInDate: string | null;
  tenantId: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;

  tenant: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };

  property: {
    id: string;
    title: string;
    description: string;
    location: string;
    city: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
    isAvailable: boolean;
    landlordId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;

    category: {
      id: string;
      name: string;
    };
  };
};

export type IPayment = {
  id: string;
  amount: number;
  status: string;
  transactionId: string;
  sessionId: string;
  paidAt: string | null;
  rentalRequestId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;

  tenant: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    phone: string | null;
    address: string | null;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };

  rentalRequest: {
    id: string;
    message: string | null;
    status: string;
    moveInDate: string | null;
    tenantId: string;
    propertyId: string;
    createdAt: string;
    updatedAt: string;

    property: {
      id: string;
      title: string;
      description: string;
      location: string;
      city: string;
      price: number;
      bedrooms: number;
      bathrooms: number;
      area: number;
      images: string[];
      isAvailable: boolean;
      landlordId: string;
      categoryId: string;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type ICreateReviewInput = {
  propertyId: string;
  rentalRequestId: string;
  rating: number;
  comment: string;
};

export type ITenantRentalRequest = {
    id: string;
    message: string | null;
    status: string;
    moveInDate: string | null;
    tenantId: string;
    propertyId: string;
    createdAt: string;
    updatedAt: string;
    property: {
        id: string;
        title: string;
        description: string;
        location: string;
        city: string;
        price: number;
        bedrooms: number;
        bathrooms: number;
        area: number;
        images: string[];
        isAvailable: boolean;
        landlordId: string;
        categoryId: string;
        createdAt: string;
        updatedAt: string;
        category?: {
            id: string;
            name: string;
            createdAt: string;
        };
        landlord?: ILandlord;
    };
    payment?: IPayment | null;
    review?: IReview | null;
};