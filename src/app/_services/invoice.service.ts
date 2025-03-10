import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceResponse } from '../_models/Invoice/invoiceResponse';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = 'https://localhost:7220/api/Invoice';

  constructor(private http: HttpClient) {}

  getInvoice(id: string): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.apiUrl}/${id}`);
  }

}
