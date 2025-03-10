import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { UserService } from '../../../_services/user.service';
import { UserModel } from '../../../_models/user';
import { Property, PropertyStatus, PropertyType } from '../../../_models/property';
import { PropertyService } from '../../../_services/property.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent { 
  date = new Date();
  totalPages: number = 10;
  loggedUserDetails: UserModel | null = null;
  users: UserModel[] = [];
  errorMessage: string = '';
  showDashboardContent = true;
  properties: Property[] = [];
  
  showProperty = false;

  constructor(
    private zone: NgZone,
    private http: HttpClient,
    private userService: UserService,
    private propertyService: PropertyService,
    private router: Router,  ) { }
  ngOnInit(): void {
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
    })
  }

  navigateToProperty(id: string) {
    this.router.navigate([`/property/${id}`]); // Navega para a página da propriedade usando o id
  }
}
