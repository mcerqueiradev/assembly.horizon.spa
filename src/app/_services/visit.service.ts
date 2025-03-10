import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreatePropertyVisitCommand } from '../_models/PropertyVisit/createPropertyVisitCommand';
import { CreatePropertyVisitResponse } from '../_models/PropertyVisit/createPropertyVisitResponse';
import { TimeSlot } from '../_models/PropertyVisit/TimeSlot';
import { PropertyVisit } from '../_models/PropertyVisit/propertyVisit';
import { PropertyVisitResponse } from '../_models/PropertyVisit/propertyVisitResponse';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
 
  private apiUrl = 'https://localhost:7220/api/PropertyVisit';

  constructor(private httpClient: HttpClient) {}

  createVisit(command: CreatePropertyVisitCommand): Observable<CreatePropertyVisitResponse> {
    return this.httpClient.post<CreatePropertyVisitResponse>(`${this.apiUrl}/Create`, command);
  }

  getAvailableTimeSlots(propertyId: string, date: string): Observable<TimeSlot[]> {
    return this.httpClient.get<{ availableSlots: TimeSlot[] }>(
      `${this.apiUrl}/available-slots`,
      { params: { propertyId, date } }
    ).pipe(
      map(response => response.availableSlots)
    );
  }

  getUserVisits(userId: string): Observable<PropertyVisitResponse> {
    return this.httpClient.get<PropertyVisitResponse>(`${this.apiUrl}/user/${userId}`);
  }
}