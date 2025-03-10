export interface ContractResponse {
  id: string;
  propertyId: string;
  customerId: string;
  realtorId: string;
  startDate: Date;
  endDate: Date;
  value: number;
  additionalFees: number;
  paymentFrequency: string;
  renewalOption: boolean;
  isActive: boolean;
  lastActiveDate: Date | null;
  contractType: string;
  status: string;
  signatureDate: Date;
  securityDeposit: number | null;
  insuranceDetails: string;
  notes: string;
  durationInMonths: number;
  contractName: string;
  createdAt: Date;
  documentPath: string;
  customerName: string;
  customerEmail: string;
  customerPhoto: string;
  realtorName: string;
  realtorEmail: string;
  realtorPhoto: string;

  // Propriedades da Property
  propertyTitle: string;
  propertyStreet: string;
  propertyCity: string;
  propertyState: string;
  propertyPostalCode: string;
  propertyCountry: string;
  propertySize: number;
  propertyBedrooms: number;
  propertyBathrooms: number;

  // Lista de imagens da propriedade
  images: PropertyImageResponse[];
}

export interface PropertyImageResponse {
  id: string;
  fileName: string;
  imagePath: string;
}
