import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RetrieveAllCategoriesResponse } from '../_models/Category/retrieveAllCategoriesResponse';
import { RetrieveCategoryResponse } from '../_models/Category/retrieveCategoryResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/api/Category`;

  constructor(private httpClient: HttpClient) {}

  retrieveAll(): Observable<RetrieveAllCategoriesResponse> {
    return this.httpClient.get<RetrieveAllCategoriesResponse>(`${this.apiUrl}/RetrieveAll`);
  }

  retrieve(id: string): Observable<RetrieveCategoryResponse> {
    return this.httpClient.get<RetrieveCategoryResponse>(`${this.apiUrl}/${id}`);
  }
}
