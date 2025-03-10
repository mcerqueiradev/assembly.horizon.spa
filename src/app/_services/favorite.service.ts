import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateFavoriteCommand } from '../_models/Favorite/createFavoriteCommand';
import { CreateFavoriteResponse } from '../_models/Favorite/createFavoriteResponse';
import { FavoritesResponse } from '../_models/Favorite/favoritesResponse';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = 'https://localhost:7220/api/Favorites';

  constructor(private httpClient: HttpClient) {}

  createFavorite(favorite: CreateFavoriteCommand): Observable<CreateFavoriteResponse> {
    return this.httpClient.post<CreateFavoriteResponse>(`${this.apiUrl}/Register`, favorite);
  }

  getFavoritesByUser(userId: string): Observable<FavoritesResponse> {
    return this.httpClient.get<FavoritesResponse>(`${this.apiUrl}/user/${userId}`);
  }

  getFavoritesByProperty(propertyId: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/property/${propertyId}`);
  }

  checkIsFavorite(userId: string, propertyId: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/check/${userId}/${propertyId}`);
  }

  removeFavorite(favoriteId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${favoriteId}`);
  }
}
