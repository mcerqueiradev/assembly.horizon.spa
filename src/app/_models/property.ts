export interface Property {
  id?: string;
  title: string;
  description: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  reference?: string;
  realtorId: string;
  categoryId: string;
  type: PropertyType;
  size: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  amenities: string;
  status: PropertyStatus;
  images?: PropertyImage[];
  isActive: boolean;
  createdAt?: Date;
  lastActiveDate?: Date;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  fileName: string;
  imagePath?: string;
  file?: File;
}

export enum PropertyType {
  Rent = 0,
  Sale = 1,
}

export enum PropertyStatus {
  Available = 'Available',
  Sold = 'Sold',
  Pending = 'Pending',
  Rented = 'Rented',
  UnderContract = 'Under Contract',
  Unavailable = 'Unavailable',
  Other = 'Other',
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  fileName: string;
  file?: File;
}
