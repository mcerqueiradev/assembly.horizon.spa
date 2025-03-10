export interface Contract {
    propertyId: string; // Guid no C# é string no TypeScript
    customerId: string;
    realtorId: string;
    startDate: Date;
    endDate: Date;
    value: number;
    additionalFees: number;
    paymentFrequency: string;
    renewalOption: boolean;
    isActive: boolean;
    lastActiveDate?: Date | null;
    contractType: ContractType;
    status: ContractStatus;
    signatureDate: Date;
    securityDeposit?: number | null;
    insuranceDetails: string;
    notes?: string;  }

  export enum ContractType {
      Sale = 'Sale',
      Rent = 'Rent',
  }
  
  export enum ContractStatus {
    Draft = 'Draft',
    Pending = 'Pending',
    Active = 'Active',
    Completed = 'Completed',
    Terminated = 'Terminated',
    Expired = 'Expired',
  }
  
  export interface CreateContractResponse {
    id: string;
    propertyId: string;
    customerId: string;
    realtorId: string;
    startDate: Date;
    endDate: Date;
    value: number;
    isActive: boolean;
    contractType: ContractType;
    status: ContractStatus;
    signatureDate?: Date;
  }