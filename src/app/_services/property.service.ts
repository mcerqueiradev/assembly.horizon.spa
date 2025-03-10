import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property, PropertyImage, PropertyStatus } from '../_models/property';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private apiUrl = 'https://localhost:7220/api/Property';

  constructor(private httpClient: HttpClient) {}

  createProperty(propertyData: Property): Observable<any> {
    const formData = new FormData();

    // Adicione cada campo ao FormData
    formData.append('Title', propertyData.title);
    formData.append('Description', propertyData.description);
    formData.append('Street', propertyData.street);
    formData.append('City', propertyData.city);
    formData.append('State', propertyData.state);
    formData.append('PostalCode', propertyData.postalCode);
    formData.append('Country', propertyData.country);
    formData.append('Reference', propertyData.reference || 'N/A');
    formData.append('RealtorId', propertyData.realtorId);
    formData.append('Type', propertyData.type.toString());
    formData.append('Size', propertyData.size.toString());
    formData.append('Bedrooms', propertyData.bedrooms.toString());
    formData.append('Bathrooms', propertyData.bathrooms.toString());
    formData.append('Price', propertyData.price.toString());
    formData.append('Amenities', propertyData.amenities);
    formData.append('Status', propertyData.status);
    formData.append('categoryId', propertyData.categoryId);

    // Adicione as imagens, se houver
    if (propertyData.images && propertyData.images.length > 0) {
      propertyData.images.forEach((image: PropertyImage, index: number) => {
        if (image.file && image.file instanceof File) {
          formData.append(`Images`, image.file, image.fileName);
        } else {
          console.warn(`Image at index ${index} is not a valid File object`);
        }
      });
    }

    console.log('FormData before sending:', formData);

    return this.httpClient.post(`${this.apiUrl}/Create`, formData);
  }

  retrieve(id: string): Observable<Property> {
    return this.httpClient.get<Property>(`${this.apiUrl}/${id}`);
  }

  retrieveLatest(): Observable<Property> {
    return this.httpClient.get<Property>(`${this.apiUrl}/RetrieveLatest`);
  }

  retrieveAll(): Observable<Property[]> {
    return this.httpClient.get<Property[]>(`${this.apiUrl}/RetrieveAll`);
  }

  retrieveAllByRealtor(realtorId: string): Observable<Property[]> {
    return this.httpClient.get<Property[]>(`${this.apiUrl}/RetrieveAllByRealtor/${realtorId}`);
  }

  togglePropertyActive(propertyId: string): Observable<any> {
    return this.httpClient.patch(`${this.apiUrl}/${propertyId}/toggle-active`, {});
  }

  // Optional: Additional admin methods
  updatePropertyStatus(propertyId: string, status: PropertyStatus): Observable<any> {
    return this.httpClient.patch(`${this.apiUrl}/${propertyId}/status`, { status });
  }

  updatePropertyPrice(propertyId: string, price: number): Observable<any> {
    return this.httpClient.patch(`${this.apiUrl}/${propertyId}/price`, { price });
  }
}
