import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from '../../../_services/property.service';
import { Property } from '../../../_models/property';

@Component({
  selector: 'app-dash-properties',
  templateUrl: './dash-properties.component.html',
  styleUrl: './dash-properties.component.scss',
})
export class DashPropertiesComponent implements OnInit {
  deactivateProperty(arg0: string | undefined) {
    throw new Error('Method not implemented.');
  }
  editProperty(arg0: string | undefined) {
    throw new Error('Method not implemented.');
  }
  viewProperty(arg0: string | undefined) {
    throw new Error('Method not implemented.');
  }
  properties: Property[] = [];
  errorMessage: string = '';

  constructor(private propertyService: PropertyService, private router: Router, private zone: NgZone) {}

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

  navigateToProperty(id: string) {
    this.router.navigate([`/property/${id}`]); // Navega para a página da propriedade usando o id
  }
}
