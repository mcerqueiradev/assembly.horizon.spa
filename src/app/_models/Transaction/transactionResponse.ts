export interface TransactionResponse {
  id: string;
  contractId: string;
  invoiceId: string;
  date: Date;
  description: string;
  status: string;
  paymentMethod: string;
  amount: number;
  createdAt: Date;
  transactionNumber: string;
  userId: string;
}
