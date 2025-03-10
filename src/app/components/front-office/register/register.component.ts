import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../_services/user.service';
import { Register } from '../../../_models/register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})

export class RegisterComponent {
  user: Register = {} as Register;
  errorMessage: string = '';
  registerSuccess: boolean = false;
  registerFailure: boolean = false;


  constructor(private router: Router, private userService: UserService) {}

  onRegister() {
    console.log(this.user);

    // Pass only the user object to the register method (no file upload at this point)
    this.userService.register(this.user).subscribe(
      (response) => {
        console.log('User created successfully:', response);
        this.registerSuccess = true;
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
      },
      (error) => {
        console.error('Error creating user:', error);
        this.errorMessage = error.message || 'Error creating user';
        this.registerFailure = true;
        setTimeout(() => {
          this.registerFailure = false;
        }, 2000);
      }
    );
  }

  signInRedirect() {
    this.router.navigateByUrl('/login');
  }
}