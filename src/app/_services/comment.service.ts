import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateCommentResponse } from '../_models/Comment/createCommentResponse';
import { CreateCommentCommand } from '../_models/Comment/createCommentCommand';
import { RetrieveCommentsResponse } from '../_models/Comment/retrieveCommentsResponse';
import { ToggleHelpfulCommand } from '../_models/Comment/toggleHelpfulCommand';
import { ToggleHelpfulResponse } from '../_models/Comment/toggleHelpfulResponse';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'https://localhost:7220/api/Comment';
  
  constructor(private http: HttpClient) {}

  getCommentsByPropertyId(propertyId: string): Observable<RetrieveCommentsResponse> {
    return this.http.get<RetrieveCommentsResponse>(`${this.apiUrl}/property/${propertyId}`);
  }

  createComment(command: CreateCommentCommand): Observable<CreateCommentResponse> {
    const formData = new FormData();
    formData.append('propertyId', command.propertyId);
    formData.append('userId', command.userId);
    formData.append('message', command.message);
    
    if (command.rating !== undefined) {
        formData.append('rating', command.rating.toString());
    }

    if (command.parentCommentId) {
        formData.append('parentCommentId', command.parentCommentId);
    }

    return this.http.post<CreateCommentResponse>(`${this.apiUrl}/Create`, formData);
  }
  
  toggleHelpful(commentId: string, userId: string, isHelpful: boolean): Observable<ToggleHelpfulResponse> {
    const command: ToggleHelpfulCommand = {
        commentId,
        userId,
        isHelpful
    };
    
    return this.http.post<ToggleHelpfulResponse>(`${this.apiUrl}/ToggleHelpful`, command);
}

}
