export interface Transaction {
  id: string;
  contractId: string;
  userId: string;
  amount: number;
  description: string;
  paymentMethod: string;
}
