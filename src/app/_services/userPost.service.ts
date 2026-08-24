import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserPostResponse } from '../_models/Post/userPost';

@Injectable({
  providedIn: 'root',
})
export class UserPostService {
  private apiUrl = `${environment.apiUrl}/api/UserPost`;

  constructor(private http: HttpClient) {}

  create(postData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, postData);
  }

  retrieveUserPosts(userId: string): Observable<UserPostResponse> {
    return this.http.get<UserPostResponse>(`${this.apiUrl}/user/${userId}`);
  }

  like(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/like`, {});
  }

  share(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/share`, {});
  }
}
