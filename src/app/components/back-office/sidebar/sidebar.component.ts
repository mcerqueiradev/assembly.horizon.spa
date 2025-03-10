import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() loggedUserDetails: any;

  constructor(private router: Router) {}

  navigateToAddProperty() {
    this.router.navigate(['back-office/dashboard/addproperty']);
  }

  navigateToTransactions() {
    this.router.navigate(['back-office/dashboard/transactions']);
  }

  navigateToSettings() {
    this.router.navigate(['back-office/dashboard/settings']);
  }

  navigateToUsers() {
    this.router.navigate(['back-office/dashboard/users']);
  }

  navigateToContracts() {
    this.router.navigate(['back-office/dashboard/contracts']);
  }
  navigateToProperty(id: string) {
    this.router.navigate([`/property/${id}`]); // Navega para a página da propriedade usando o id
  }

  navigateToProperties() {
    this.router.navigate(['back-office/dashboard/properties']);
  }

  logOut() {
    sessionStorage.removeItem('loggedUser');
    sessionStorage.removeItem('loggedUserDetails');
    this.router.navigateByUrl('/login');
  }
}
