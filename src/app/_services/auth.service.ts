import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModel } from '../_models/loginModel';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/Auth`;

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(loginObj: LoginModel): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/login`, loginObj).pipe(
      tap((response) => {
        sessionStorage.setItem('loggedUser', JSON.stringify(response));
        sessionStorage.setItem('token', response.token);
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getLoggedUser() {
    const loggedUserString = sessionStorage.getItem('loggedUser');
    if (!loggedUserString) {
      this.router.navigateByUrl('/login');
      return null;
    }
    return JSON.parse(loggedUserString);
  }

  getLoggedUserWithoutRedirect() {
    const loggedUserString = sessionStorage.getItem('loggedUser');
    return loggedUserString ? JSON.parse(loggedUserString) : null;
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('loggedUser') && !!sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.removeItem('loggedUser');
    sessionStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
