import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Notification } from '../_models/Notification/notification';
import { NotificationResponse } from '../_models/Notification/notificationResponse';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = `${environment.apiUrl}/api/Notification`;

  constructor(private http: HttpClient) {}

  getNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}?userId=${userId}`);
  }

  getRecentNotifications(userId: string): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${this.apiUrl}/recent?userId=${userId}`);
  }
  
  markAsRead(notificationId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${notificationId}/read`, {});
  }
}
