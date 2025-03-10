import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../_models/User/userProfile';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUrl = 'https://localhost:7220/api/UserProfile';

  constructor(private http: HttpClient) {}

  retrieveUserProfile(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateProfile(profileId: string, data: Partial<UserProfile> | FormData): Observable<UserProfile> {
    if (data instanceof FormData) {
      return this.http.put<UserProfile>(`${this.apiUrl}/${profileId}`, data);
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof Partial<UserProfile>];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    return this.http.put<UserProfile>(`${this.apiUrl}/${profileId}`, formData);
  }
}
