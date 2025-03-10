import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyService } from '../../../_services/property.service';
import { Property, PropertyImage, PropertyStatus, PropertyType } from '../../../_models/property';
import { Router } from '@angular/router';
import { StateService } from '../../../_services/state.service';
import { CategoryService } from '../../../_services/category.service';
import { RetrieveCategoryResponse } from '../../../_models/Category/retrieveCategoryResponse';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.scss',
})
export class AddPropertyComponent implements OnInit {
  propertyForm!: FormGroup;
  propertyTypes = Object.values(PropertyType);
  propertyStatuses = Object.values(PropertyStatus);
  selectedAmenities: string[] = [];
  availableAmenities: string[] = [
    'Swimming Pool',
    'Gym',
    'Playground',
    'Parking',
    'Garden',
    'Elevator',
    'Security System',
    'Concierge Service',
    'Balcony',
    'Terrace',
    'Rooftop Deck',
    'Central Air Conditioning',
    'In-unit Laundry',
    'Walk-in Closet',
    'Fireplace',
    'Hardwood Floors',
    'Stainless Steel Appliances',
    'Granite Countertops',
    'High Ceilings',
    'Pet-friendly',
    'Storage Space',
    'Bike Storage',
    'EV Charging Station',
    'Smart Home Features',
    'Fitness Center',
    'Sauna',
    'Spa',
    'Tennis Court',
    'Basketball Court',
    'Clubhouse',
    'Business Center',
    'Conference Room',
    'Movie Theater',
    'Game Room',
    'Library',
    'Wine Cellar',
    'Outdoor Kitchen',
    'BBQ Area',
    'Fire Pit',
    'Jogging Trail',
    'Dog Park',
    'Playroom',
    'On-site Maintenance',
    '24/7 Security',
    'Gated Community',
    'Waterfront View',
    'Mountain View',
    'City View',
  ];
  loggedUserId: string = '';
  selectedFiles: File[] = [];
  imageMetadatas: PropertyImage[] = [];

  countries: string[] = [];
  states: string[] = [];

  categories: RetrieveCategoryResponse[] = [];

  addpropertySuccess: boolean = false;
  addpropertyFailure: boolean = false;

  propertyTypeOptions = [
    { label: 'Rent', value: PropertyType.Rent },
    { label: 'Sale', value: PropertyType.Sale },
  ];

  constructor(private fb: FormBuilder, private propertyService: PropertyService, private router: Router, private stateService: StateService, private categoryService: CategoryService) {}

  ngOnInit() {
    this.getLoggedUserId();
    this.initForm();
    this.loadCountries();
    this.loadCategories();
  }

  getLoggedUserId() {
    const loggedUserString = sessionStorage.getItem('loggedUser');
    if (loggedUserString) {
      const loggedUser = JSON.parse(loggedUserString);
      this.loggedUserId = loggedUser.userId;
    }
  }

  loadCountries() {
    this.stateService.getCountries().subscribe(
      (data) => {
        this.countries = data.map((country: any) => country.name.common).sort();
        console.log('Countries loaded:', this.countries);
      },
      (error) => {
        console.error('Error loading countries:', error);
      }
    );
  }

  loadCategories() {
    this.categoryService.retrieveAll().subscribe({
      next: (response) => {
        this.categories = response.categories;
        console.log('Categories loaded:', this.categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  initForm() {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      type: ['', Validators.required],
      size: [null, [Validators.required, Validators.min(0)]],
      bedrooms: [null, [Validators.required, Validators.min(0)]],
      bathrooms: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      realtorId: [this.loggedUserId, Validators.required],
      amenities: this.fb.array([], Validators.required),
      images: [[], Validators.required],
      categoryId: ['', Validators.required],
      isActive: true,
    });
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      const propertyData: Property = {
        title: this.propertyForm.get('title')?.value,
        description: this.propertyForm.get('description')?.value,
        street: this.propertyForm.get('street')?.value,
        city: this.propertyForm.get('city')?.value,
        state: this.propertyForm.get('state')?.value,
        postalCode: this.propertyForm.get('postalCode')?.value,
        country: this.propertyForm.get('country')?.value,
        reference: this.propertyForm.get('reference')?.value || 'N/A',
        realtorId: this.loggedUserId,
        type: this.propertyForm.get('type')?.value,
        size: this.propertyForm.get('size')?.value,
        bedrooms: this.propertyForm.get('bedrooms')?.value,
        bathrooms: this.propertyForm.get('bathrooms')?.value,
        price: this.propertyForm.get('price')?.value,
        amenities: this.selectedAmenities.join(', '),
        status: this.propertyForm.get('status')?.value,
        images: this.imageMetadatas.filter((img) => img.file instanceof File),
        categoryId: this.propertyForm.get('categoryId')?.value,
        isActive: true,
      };

      console.log('Property data before submission:', propertyData);

      this.propertyService.createProperty(propertyData).subscribe({
        next: (response) => {
          console.log('Success!', response);
          this.addpropertySuccess = true;
          setTimeout(() => {
            this.router.navigateByUrl('back-office/dashboard');
          }, 2000);
        },
        error: (error) => {
          console.error('There was an error!', error);
          this.addpropertyFailure = true;
        },
      });
    } else {
      console.log('Form is invalid', this.propertyForm.errors);
      this.propertyForm.markAllAsTouched();
      alert('Please fill in all required fields.');
    }
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      // Adicionar os arquivos selecionados à lista de arquivos já existentes
      this.selectedFiles = [...this.selectedFiles, ...Array.from(fileList)];
      this.imageMetadatas = this.selectedFiles.map((file) => ({
        id: '',
        propertyId: '',
        fileName: file.name,
        file: file,
      }));

      console.log('Image metadatas:', this.imageMetadatas);

      // Atualizar o controle do formulário
      this.propertyForm.patchValue({ images: this.imageMetadatas });
      this.propertyForm.get('images')?.updateValueAndValidity();

      // Limpar a pré-visualização antiga
      const uploadedImagesDiv = document.getElementById('uploadedImages');
      if (uploadedImagesDiv) {
        uploadedImagesDiv.innerHTML = ''; // Limpa as imagens anteriores

        // Criar a pré-visualização para todas as imagens selecionadas
        this.selectedFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result; // URL da imagem
            imgElement.alt = file.name;
            imgElement.classList.add('w-32', 'h-32', 'object-cover', 'rounded-lg', 'mr-2', 'mb-2'); // Classes CSS
            uploadedImagesDiv.appendChild(imgElement);
          };
          reader.readAsDataURL(file); // Ler o arquivo como URL
        });
      }
    } else {
      console.log('No files selected');
    }
  }

  get amenities(): FormArray {
    return this.propertyForm.get('amenities') as FormArray;
  }

  addAmenity(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const amenity = selectElement.value;

    if (amenity && !this.selectedAmenities.includes(amenity)) {
      this.selectedAmenities.push(amenity);
      this.amenities.push(this.fb.control(amenity));
    }

    selectElement.value = '';
  }

  removeAmenity(amenity: string): void {
    const index = this.selectedAmenities.indexOf(amenity);
    if (index > -1) {
      this.selectedAmenities.splice(index, 1);
      this.amenities.removeAt(index);
    }
  }
}
