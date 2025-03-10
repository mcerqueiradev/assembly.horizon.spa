import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Property, PropertyType } from '../../../_models/property';
import { UserModel } from '../../../_models/user';
import { PropertyService } from '../../../_services/property.service';
import { UserService } from '../../../_services/user.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'], // Corrected 'styleUrl' to 'styleUrls'
})
export class PropertiesComponent implements OnInit {
  date = new Date();
  totalPages: number = 10;
  loggedUserDetails: UserModel | null = null;
  users: UserModel[] = [];
  errorMessage: string = '';
  showDashboardContent = true;
  properties: Property[] = [];
  showProperty = false;
  @ViewChildren('propertyCard') propertyCards!: QueryList<ElementRef>;

  constructor(private zone: NgZone, private http: HttpClient, private userService: UserService, private propertyService: PropertyService, private router: Router) {}

  ngOnInit(): void {
    this.propertyService.retrieveAll().subscribe({
      next: (response: any) => {
        this.zone.run(() => {
          if (response && response.properties) {
            this.properties = response.properties;
            console.log(this.properties);
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
  }

  navigateToProperty(id: string | undefined) {
    this.router.navigate([`/property/${id}`]); // Navigate to the property page using the id
  }

  navigateToProperties() {
    this.router.navigate([`/properties`]); // Navigate to the property page using the id
  }

  scheduleViewing(propertyId: string): void {
    this.router.navigate(['/property', propertyId], {
      queryParams: { openSchedule: 'true' },
    });
  }

  downloadBrochure(id: string): void {
    // Handle brochure download
  }
}
