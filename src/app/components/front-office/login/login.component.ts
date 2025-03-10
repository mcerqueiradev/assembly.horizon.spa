import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModel } from '../../../_models/loginModel';
import { AuthService } from '../../../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginObj: LoginModel = {} as LoginModel;
  errorMessage: string = '';
  loginSuccess: boolean = false;
  loginFailure: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('back-office/dashboard');
    }
  }

  onLogin() {
    this.authService.login(this.loginObj).subscribe({
      next: (response) => {
        this.loginSuccess = true;
        setTimeout(() => {
          this.router.navigateByUrl('back-office/dashboard');
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Ocorreu um erro durante o login';
        this.loginFailure = true;
        setTimeout(() => {
          this.loginFailure = false;
        }, 2000);
      }
    });
  }

  signUp() {
    this.router.navigateByUrl('/register');
  }
}