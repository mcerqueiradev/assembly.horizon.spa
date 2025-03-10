import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, NgZone, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Property } from '../../../_models/property';
import { UserModel } from '../../../_models/user';
import { PropertyService } from '../../../_services/property.service';
import { UserService } from '../../../_services/user.service';

interface PropertyWithCoordinates extends Property {
  coordinates?: {
    lat: number;
    lng: number;
  };
}

@Component({
  selector: 'app-allproperties',
  templateUrl: './allproperties.component.html',
  styleUrl: './allproperties.component.scss',
})
export class AllpropertiesComponent {
  properties: PropertyWithCoordinates[] = [];
  center: google.maps.LatLngLiteral = { lat: -23.5505, lng: -46.6333 }; // São Paulo
  zoom = 12;
  markers: google.maps.marker.AdvancedMarkerElement[] = [];
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };

  date = new Date();
  totalPages: number = 10;
  loggedUserDetails: UserModel | null = null;
  users: UserModel[] = [];
  errorMessage: string = '';
  showDashboardContent = true;
  showProperty = false;
  @ViewChildren('propertyCard') propertyCards!: QueryList<ElementRef>;

  isTypeFilterOpen = false;
  isPriceFilterOpen = false;
  isStatusFilterOpen = false;

  toggleTypeFilter() {
    this.isTypeFilterOpen = !this.isTypeFilterOpen;
    this.isPriceFilterOpen = false;
    this.isStatusFilterOpen = false;
  }

  togglePriceFilter() {
    this.isPriceFilterOpen = !this.isPriceFilterOpen;
    this.isTypeFilterOpen = false;
    this.isStatusFilterOpen = false;
  }

  toggleStatusFilter() {
    this.isStatusFilterOpen = !this.isStatusFilterOpen;
    this.isTypeFilterOpen = false;
    this.isPriceFilterOpen = false;
  }

  viewMode: 'grid' | 'list' = 'list';

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  constructor(private zone: NgZone, private http: HttpClient, private userService: UserService, private propertyService: PropertyService, private router: Router) {}

  ngOnInit(): void {
    this.propertyService.retrieveAll().subscribe({
      next: (response: any) => {
        this.zone.run(async () => {
          if (response && response.properties) {
            this.properties = response.properties;
            await this.loadPropertyCoordinates();

            // Set map center to first property
            if (this.properties[0]?.coordinates) {
              this.center = this.properties[0].coordinates;
            }
          }
        });
      },
    });
  }

  focusPropertyOnMap(property: PropertyWithCoordinates) {
    if (property.coordinates) {
      this.center = property.coordinates;
      this.zoom = 15; // Zoom in for better view
    }
  }

  private getFullAddress(property: Property): string {
    const addressParts = [property.street, property.city, property.state, property.postalCode, property.country].filter(Boolean); // This removes any empty or undefined values

    return addressParts.join(', ');
  }

  private async loadPropertyCoordinates() {
    const geocoder = new google.maps.Geocoder();

    for (const property of this.properties) {
      try {
        const fullAddress = this.getFullAddress(property);
        const coordinates = await this.getCoordinates(geocoder, fullAddress);
        property.coordinates = coordinates;
      } catch (error) {
        console.error(`Error getting coordinates for property ${property.id}:`, error);
      }
    }
  }

  private getCoordinates(geocoder: google.maps.Geocoder, address: string): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          reject(status);
        }
      });
    });
  }

  onMarkerClick(property: Property) {
    this.navigateToProperty(property.id);
  }

  navigateToProperty(id: string | undefined) {
    this.router.navigate([`/property/${id}`]);
  }
}
