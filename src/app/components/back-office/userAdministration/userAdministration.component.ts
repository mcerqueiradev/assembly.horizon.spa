import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_services/user.service';
import { UserModel } from '../../../_models/user';
import { AuthService } from '../../../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-administration',
  templateUrl: './userAdministration.component.html',
  styleUrl: './userAdministration.component.scss',
})
export class UserAdministrationComponent implements OnInit {
  users: UserModel[] = [];
  loggedUserDetails: UserModel | null = null;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userService.retrieveAll().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Users loaded successfully:', this.users.length);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });

    this.loggedUserDetails = this.authService.getLoggedUser();
  }

  // Method to check if user is admin
  isAdmin(): boolean {
    return this.loggedUserDetails?.access === 'SystemAdministrator';
  }

  getActiveUsersCount(): number {
    return this.users.filter((user) => user.isActive).length;
  }

  getRealtorsCount(): number {
    return this.users.filter((user) => user.access == 'LicensedAgent').length;
  }

  getsSuspendedUserCount(): number {
    return this.users.filter((user) => user.access == 'SuspendedUser').length;
  }

  // Method to handle user operations
  handleUserOperation(userId: string, operation: string): void {
    switch (operation) {
      case 'edit':
        this.editUser(userId);
        break;
      case 'delete':
        this.deleteUser(userId);
        break;
    }
  }

  navigateToProfile(userId: string): void {
    this.router.navigate(['/profile/', userId]);
  }

  private editUser(userId: string): void {
    // Implement edit logic
  }

  private deleteUser(userId: string): void {
    // Implement delete logic
  }
}
