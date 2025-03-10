import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token');
    console.log('Current token:', token); // Verify token exists

    if (token && request.method !== 'OPTIONS') {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
      console.log('Request with auth:', cloned.headers.get('Authorization')); // Verify header
      return next.handle(cloned);
    }

    return next.handle(request);
  }
}
