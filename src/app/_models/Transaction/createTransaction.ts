export interface CreateTransaction {
    contractId: string;
    userId: string;
    amount: number;
    description: string;
    paymentMethod: string;
  }