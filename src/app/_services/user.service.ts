import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserModel } from '../_models/user';
import { Register } from '../_models/register';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7220/api';

  constructor(private httpClient: HttpClient, private router: Router) {}

  retrieveAll(): Observable<UserModel[]> {
    return this.httpClient.get<{ users: UserModel[] }>(`${this.apiUrl}/User/RetrieveAll`).pipe(map((response) => response.users));
  }

  retrieveNonAdmins(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>(`${this.apiUrl}/User/RetrieveNonAdmins`);
  }

  retrieve(userId: string): Observable<UserModel> {
    return this.httpClient.get<UserModel>(`${this.apiUrl}/User/${userId}`);
  }

  register(user: Register): Observable<UserModel> {
    return this.httpClient.post<UserModel>(`${this.apiUrl}/User/Register`, user);
  }

  // New method for updating user details including file upload
  updateProfile(userId: string, userData: Partial<UserModel>, file: File | null): Observable<UserModel> {
    const formData = new FormData();

    // Adicionar os dados do usuário ao FormData
    Object.keys(userData).forEach((key) => {
      const value = userData[key as keyof Partial<UserModel>];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Adicionar o arquivo, se existir
    if (file) {
      formData.append('Upload', file, file.name);
    }

    // Não definimos o Content-Type manualmente, deixamos o navegador configurar automaticamente
    return this.httpClient.put<UserModel>(`${this.apiUrl}/User/${userId}`, formData);
  }
}
