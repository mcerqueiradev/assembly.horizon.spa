import { PropertyImageResponse } from "../contractResponse";

export interface InvoiceResponse {
  id: string;
  contractId: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  status: string;
  createdAt: Date;
  propertyName: string;
  propertyAddress: string;
  contractAmount: number;
  contractStartDate: Date;
  contractEndDate: Date;
  contractType: string;
  paymentFrequency: string;
  durationInMonths: number;
  additionalFees: number;
  securityDeposit: number | null;
  images: PropertyImageResponse[];
  customerName: string;
  customerEmail: string;
  customerPhoto: string | null;
  realtorName: string;
  realtorEmail: string;
  realtorPhoto: string | null;
  transactionNumber: string | null;
}

