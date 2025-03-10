import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../_services/property.service';
import { catchError, of } from 'rxjs';
import { Property } from '../../../_models/property';
import { RealtorService } from '../../../_services/realtor.service';
import { Realtor } from '../../../_models/realtor';
import { UserService } from '../../../_services/user.service';
import { UserModel } from '../../../_models/user';
import { FavoriteService } from '../../../_services/favorite.service';
import { CreateFavoriteCommand } from '../../../_models/Favorite/createFavoriteCommand';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrl: './property.component.scss',
})
export class PropertyComponent implements OnInit {
  property?: Property;
  realtor?: Realtor;
  user?: UserModel;
  adminUser?: UserModel;
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  showLoginWarning: boolean = false;
  showSuccessMessage: boolean = false;
  showAdminActions: boolean = false;
  userId?: string;
  isFavorite: boolean = false;
  isScheduleModalOpen: boolean = false;
  isProposalModalOpen: boolean = false;
  isDropdownOpen: boolean = false;
  isAdmin: boolean = false;
  selectedImage: string | null = null;
  showImageModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private realtorService: RealtorService,
    private userService: UserService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    const propertyId = this.route.snapshot.paramMap.get('id');
    const loggedUserString = sessionStorage.getItem('loggedUser');

    // Handle logged user and admin check
    if (loggedUserString) {
      const loggedUser = JSON.parse(loggedUserString);
      this.isLoggedIn = true;
      this.userId = loggedUser.userId;
      this.isAdmin = loggedUser.access === 'SystemAdministrator';

      if (propertyId && this.userId) {
        this.checkIsFavorite(this.userId, propertyId);

        this.userService.retrieve(this.userId).subscribe({
          next: (userData) => {
            this.adminUser = userData;
            this.isAdmin = userData.access === 'SystemAdministrator';
          },
          error: (error) => {
            console.error('Error fetching user details:', error);
          },
        });
      }
    }

    // Load property and realtor details
    if (propertyId) {
      this.propertyService.retrieve(propertyId).subscribe({
        next: (propertyData) => {
          this.property = propertyData;
          if (this.property?.realtorId) {
            this.fetchRealtorDetails(this.property.realtorId);
          }
        },
        error: (error) => {
          console.error('Error fetching property:', error);
          this.errorMessage = 'Could not load property details.';
        },
      });
    }
  }

  // Add admin methods
  togglePropertyActive(): void {
    if (this.property?.id) {
      this.propertyService.togglePropertyActive(this.property.id).subscribe({
        next: (response) => {
          this.property!.isActive = response.isActive;
          this.property!.lastActiveDate = response.lastActiveDate;
        },
        error: (error) => {
          console.error('Error toggling property status:', error);
          this.errorMessage = 'Failed to update property status.';
        },
      });
    }
  }

  private fetchRealtorDetails(realtorId: string) {
    this.realtorService.retrieve(realtorId).subscribe((data) => {
      if (data) {
        this.realtor = data;
        this.fetchUserDetails(this.realtor.userId);
      }
    });
  }

  private fetchUserDetails(userId: string) {
    this.userService
      .retrieve(userId)
      .pipe(
        catchError((error) => {
          console.error('Error fetching user:', error);
          this.errorMessage = 'Could not load user details. Please try again later.';
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.user = data;
          console.log('User:', this.user);
        }
      });
  }

  private checkIsFavorite(userId: string, propertyId: string) {
    this.favoriteService.checkIsFavorite(userId, propertyId).subscribe({
      next: (response) => {
        this.isFavorite = response.isFavorite;
      },
      error: (error) => {
        console.error('Error checking favorite status:', error);
      },
    });
  }

  addFavorite(): void {
    if (!this.isLoggedIn) {
      this.showLoginWarning = true;
      setTimeout(() => {
        this.showLoginWarning = false;
      }, 5000);
      return;
    }

    if (this.isFavorite) {
      this.errorMessage = 'This property is already in your favorites!';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }

    if (this.property) {
      const favoriteCommand: CreateFavoriteCommand = {
        userId: this.userId!,
        propertyId: this.property.id!,
        categoryId: this.property.categoryId,
        notes: '',
      };

      this.favoriteService.createFavorite(favoriteCommand).subscribe({
        next: (response) => {
          this.isFavorite = true;
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Error adding favorite:', error);
          this.errorMessage = 'Failed to add property to favorites.';
        },
      });
    }
  }

  shareOnWhatsApp(): void {
    const message = encodeURIComponent('I found this amazing property! Check it out:');
    const url = encodeURIComponent(window.location.href); // URL da página atual
    const whatsappUrl = `https://api.whatsapp.com/send?text=${message} ${url}`;

    window.open(whatsappUrl, '_blank'); // Abre o link em uma nova aba
  }

  shareOnEmail(): void {
    const subject = encodeURIComponent('Check this amazing property!');
    const body = encodeURIComponent('I found this amazing property. Check it out: ' + window.location.href);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;

    window.open(mailtoUrl, '_blank');
  }

  get amenitiesArray(): string[] {
    return this.property?.amenities?.split(', ') || [];
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  openScheduleModal() {
    this.isScheduleModalOpen = true;
    this.isDropdownOpen = false;
  }

  openProposalModal() {
    this.isProposalModalOpen = true;
    this.isDropdownOpen = false;
  }

  closeScheduleModal() {
    this.isScheduleModalOpen = false;
  }

  closeProposalModal() {
    this.isProposalModalOpen = false;
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  openImageModal(imagePath: string) {
    this.selectedImage = imagePath;
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
    this.selectedImage = null;
  }
}
