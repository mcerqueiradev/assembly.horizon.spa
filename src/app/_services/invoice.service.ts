import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceResponse } from '../_models/Invoice/invoiceResponse';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = `${environment.apiUrl}/api/Invoice`;

  constructor(private http: HttpClient) {}

  getInvoice(id: string): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.apiUrl}/${id}`);
  }

}
