import { UserModel } from "./user";

export interface Realtor {
    id: string;
    access: number;
    user: UserModel;
    userId: string;
    officeEmail: string;
    totalSales: string;
    totalListings: string;
    certifications: string[];
    languagesSpoken: string[];
  }
  