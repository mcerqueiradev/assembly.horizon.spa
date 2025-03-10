import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { CreateTransaction } from '../_models/Transaction/createTransaction';
import { TransactionsResponse } from '../_models/Transaction/transactionsResponse';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'https://localhost:7220/api/Transaction';

  constructor(private http: HttpClient) {}

  createTransaction(transactionData: CreateTransaction): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Register`, transactionData);
  }

  getTransactionsByUser(userId: string): Observable<TransactionsResponse> {
    return this.http.get<TransactionsResponse>(`${this.apiUrl}/user/${userId}`);
  }

  getTransactions(): Observable<TransactionsResponse> {
    return this.http.get<TransactionsResponse>(`${this.apiUrl}`);
  }

  processPayment(paymentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${paymentData.transactionId}/process`, {
      paymentMethod: paymentData.paymentMethod,
      status: 'Completed',
    });
  }
}
