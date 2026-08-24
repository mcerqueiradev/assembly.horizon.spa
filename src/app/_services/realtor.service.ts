import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Realtor } from '../_models/realtor';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtorService {

  private apiUrl = `${environment.apiUrl}/api/Realtor`;

  constructor(private httpClient: HttpClient, private router: Router) { }

  retrieve(id: string): Observable<Realtor> {
    return this.httpClient.get<Realtor>(`${this.apiUrl}/${id}`);
  }

  retrieveByUserId(userId: string): Observable<Realtor> {
    return this.httpClient.get<Realtor>(`${this.apiUrl}/ByUserId/${userId}`);
  }

}
