import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgZone, HostListener, ChangeDetectorRef, AfterViewInit, ElementRef } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs';
import { Property } from '../../../_models/property';
import { UserModel } from '../../../_models/user';
import { PropertyService } from '../../../_services/property.service';
import { UserService } from '../../../_services/user.service';
import { NotificationService } from '../../../_services/notification.service';
import { Notification } from '../../../_models/Notification/notification';
import { NotificationResponse } from '../../../_models/Notification/notificationResponse';
import { VisitService } from '../../../_services/visit.service';
import { PropertyVisitResponse } from '../../../_models/PropertyVisit/propertyVisitResponse';
import { TimeSlotPipe } from '../../../_shared/pipes/timeSlot.pipe';
import { FavoriteService } from '../../../_services/favorite.service';
import { Favorite } from '../../../_models/Favorite/favorite';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [TimeSlotPipe],
})
export class DashboardComponent implements OnInit {
  date = new Date();
  totalPages: number = 10;
  loggedUserDetails: UserModel | null = null;
  users: UserModel[] = [];
  errorMessage: string = '';
  showDashboardContent = true;
  properties: Property[] = [];
  favorites: Favorite[] = [];
  notifications: Notification[] = [];
  showNotifications = false;
  propertyVisitResponse: PropertyVisitResponse = { visits: [] };

  constructor(
    private zone: NgZone,
    private http: HttpClient,
    private userService: UserService,
    private propertyService: PropertyService,
    private notificationService: NotificationService,
    private favoriteService: FavoriteService,
    private visitService: VisitService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.showDashboardContent =
        !event.urlAfterRedirects.includes('/addproperty') &&
        !event.urlAfterRedirects.includes('/settings') &&
        !event.urlAfterRedirects.includes('/contracts') &&
        !event.urlAfterRedirects.includes('/transactions') &&
        !event.urlAfterRedirects.includes('/contract') &&
        !event.urlAfterRedirects.includes('/invoices') &&
        !event.urlAfterRedirects.includes('/proposals') &&
        !event.urlAfterRedirects.includes('/proposal') &&
        !event.urlAfterRedirects.includes('/properties') &&
        !event.urlAfterRedirects.includes('/users');
    });
  }

  ngOnInit(): void {
    const loggedUserString = sessionStorage.getItem('loggedUser');

    if (!loggedUserString) {
      this.router.navigateByUrl('/login');
      return;
    }

    const loggedUser = JSON.parse(loggedUserString);
    const userId = loggedUser.userId;
    this.loadNotifications(userId);

    this.userService.retrieve(userId).subscribe({
      next: (userDetails: UserModel) => {
        this.zone.run(() => {
          this.loggedUserDetails = userDetails;
        });
      },
      error: (error) => {
        console.error('Erro ao buscar detalhes do usuário:', error);
        this.errorMessage = 'Falha ao carregar os detalhes do usuário';
      },
    });

    this.propertyService.retrieveAll().subscribe({
      next: (response: any) => {
        this.zone.run(() => {
          if (response && response.properties) {
            this.properties = response.properties;
          } else {
            console.error('Resposta inválida do servidor');
            this.errorMessage = 'Dados de imóveis inválidos';
          }
        });
      },
      error: (error) => {
        console.error('Erro ao buscar imóveis:', error);
        this.errorMessage = 'Falha ao carregar imóveis';
      },
    });

    this.visitService.getUserVisits(userId).subscribe({
      next: (response: PropertyVisitResponse) => {
        this.zone.run(() => {
          this.propertyVisitResponse = response;
          console.log('User visits:', this.propertyVisitResponse.visits);
        });
      },
      error: (error) => {
        console.error('Erro ao buscar visitas:', error);
        this.errorMessage = 'Falha ao carregar visitas';
      },
    });

    this.favoriteService.getFavoritesByUser(userId).subscribe({
      next: (response) => {
        this.favorites = response.favorites;
      },
    });
  }

  loadNotifications(userId: string) {
    this.notificationService.getRecentNotifications(userId).subscribe({
      next: (response: NotificationResponse) => {
        this.notifications = response.notifications;
        console.log(this.notifications);
      },
    });
  }

  hasNotifications(): boolean {
    return this.notifications.length > 0;
  }

  closeNotificationsPanel() {
    this.showNotifications = false;
  }

  toggleNotifications(event: MouseEvent) {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
  }

  totalPrice(): number {
    if (this.properties.length === 0) {
      return 0; // Retorna 0 se não houver propriedades
    }

    return this.properties.reduce((total, property) => {
      const price = property.price || 0; // Utiliza 0 se o preço for nulo ou indefinido
      return total + Number(price); // Converte o preço para número e acumula
    }, 0);
  }

  getAccessString(access: number): string {
    switch (access) {
      case 0:
        return 'None';
      case 1:
        return 'Guest';
      case 2:
        return 'User';
      case 3:
        return 'Realtor';
      case 4:
        return 'Admin';
      case 5:
        return 'Blocked';
      default:
        return 'Unknown';
    }
  }

  getHour() {
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Night';
    }
  }

  timeNow() {
    const time = new Date().getTime();
    return time;
  }

  navigateToAddProperty() {
    this.router.navigate(['back-office/dashboard/addproperty']);
  }

  navigateToTransactions() {
    this.router.navigate(['back-office/dashboard/transactions']);
  }

  navigateToProposals() {
    this.router.navigate(['back-office/dashboard/proposals']);
  }

  navigateToProperty(id: string) {
    this.router.navigate([`/property/${id}`]); // Navega para a página da propriedade usando o id
  }

  navigateToProfile(id: string) {
    this.router.navigate([`/profile/${id}`]); // Navega para a página da propriedade usando o id
  }

  logOut() {
    sessionStorage.removeItem('loggedUser');
    sessionStorage.removeItem('loggedUserDetails');
    this.router.navigateByUrl('/login');
  }

  hasAppointments(): boolean {
    return this.propertyVisitResponse?.visits?.length > 0;
  }

  hasFavorites(): boolean {
    return this.favorites?.length > 0;
  }
}
