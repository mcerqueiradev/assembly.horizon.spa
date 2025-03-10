import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { UserModel } from '../../../_models/user';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../../_services/user.service';
import { DOCUMENT } from '@angular/common';
import { Access } from '../../../_models/enumAccess';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  userForm: FormGroup; // Formulário reativo
  loggedUserDetails: UserModel | null = null;
  selectedFile: File | null = null; // Arquivo selecionado (ex: foto de perfil)
  userId: string = ''; // ID do usuário (obtido ao carregar os dados do usuário)
  errorMessage: string = '';
  fileName: string | null = null; // Para armazenar o nome do arquivo
  imagePreview: string | null = null;
  profileCompletionPercentage: number = 0;
  updateSuccess: boolean = false;
  updateFailure: boolean = false;
  fieldWeights = {
    firstName: 20,     // 20% do total
    lastName: 20,      // 20% do total
    phoneNumber: 20,   // 20% do total
    email: 20,         // 20% do total
    dateOfBirth: 20,   // 20% do total
    imageUrl: 20       // 20% do total
  };
  accessEnum = Access;
  isSystemAdministrator: boolean = false;
  

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    // Inicializando o formulário com os campos necessários
    this.userForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      email: [''],
      dateOfBirth: [''],
      access: [{ value: '', disabled: true }],
      upload: [''],
    });
  }

  ngOnInit(): void {
    this.loadUserData(); // Carregar os dados do usuário ao inicializar
  }

  triggerFileInput(): void {
    const fileInput = this.document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Aciona o input file
    }
  }

  loadUserData() {
    const loggedUserString = sessionStorage.getItem('loggedUser');
    if (!loggedUserString) {
      this.router.navigateByUrl('back-office/dashboard');
      return;
    }
  
    const loggedUser = JSON.parse(loggedUserString);
    this.userId = loggedUser.userId;
  
    this.userService.retrieve(this.userId).subscribe({
      next: (userDetails: UserModel) => {
        this.zone.run(() => {
          this.loggedUserDetails = userDetails;
                    
          this.isSystemAdministrator = userDetails.access === this.accessEnum.SystemAdministrator;
          
          const accessControl = this.userForm.get('access');
          if (accessControl) {
            if (this.isSystemAdministrator) {
              accessControl.enable();
            } else {
              accessControl.disable();
            }
          }
  
          this.userForm.patchValue({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            phoneNumber: userDetails.phoneNumber,
            email: userDetails.email,
            dateOfBirth: userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth).toISOString().split('T')[0] : '',
            access: userDetails.access,
          });
  
          this.calculateProfileCompletion();
        });
      },
      error: (error) => {
        console.error('Erro ao buscar detalhes do usuário:', error);
        this.errorMessage = 'Falha ao carregar os detalhes do usuário';
      },
    });
  }

  get accessOptions() {
    return Object.entries(this.accessEnum).map(([key, value]) => ({ key, value }));
  }

  calculateProfileCompletion() {
    const totalFields = 6;
    let filledFields = 0;
  
    console.log('loggedUserDetails:', this.loggedUserDetails);
  
    if (this.loggedUserDetails) {
      if (this.loggedUserDetails.firstName) {
        filledFields++;
      }
      if (this.loggedUserDetails.lastName) {
        filledFields++;      }
      if (this.loggedUserDetails.phoneNumber) {
        filledFields++;      }
      if (this.loggedUserDetails.email) {
        filledFields++;      }
      if (this.loggedUserDetails.dateOfBirth) {
        filledFields++;      }
      if (this.loggedUserDetails.imageUrl) {
        filledFields++;      }
    }
  
    this.profileCompletionPercentage = Math.round((filledFields / totalFields) * 100);
  }

  getPath(completionPercentage: number): string {
    const radius = 90; // Raio do círculo
    const circumference = 2 * Math.PI * radius; // Circunferência total
  
    // Verificar se a porcentagem é 100% para preencher o círculo
    if (completionPercentage === 100) {
      return `M100 10 A ${radius} ${radius} 0 1 1 100 190 A ${radius} ${radius} 0 1 1 100 10`; // Retorna um caminho completo
    }
  
    // Calcular a parte preenchida do gráfico
    const progress = (completionPercentage / 100) * circumference; // Progresso baseado na porcentagem
  
    // Cálculo do ângulo final com base no progresso
    const endAngle = (progress / circumference) * 360; // Ângulo final em graus
    const largeArcFlag = endAngle > 180 ? 1 : 0; // Define se é um arco grande ou pequeno
  
    // Usando a fórmula para calcular as coordenadas do final do arco
    const x = 100 + radius * Math.sin((endAngle * Math.PI) / 180); // Coord. X
    const y = 100 - radius * Math.cos((endAngle * Math.PI) / 180); // Coord. Y
  
    return `M100 10 A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y}`; // Retorna o caminho
  }
  
  // Método que captura o arquivo selecionado (foto de perfil, etc)
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name; // Armazena o nome do arquivo

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // Armazena a URL da imagem
      };
      reader.readAsDataURL(file); // Lê o arquivo como URL
    }
  }

  // Método para atualizar as informações do usuário
  updateUser() {
    if (this.userForm.valid && this.loggedUserDetails) {
      const updatedUser: Partial<UserModel> = {
        id: this.loggedUserDetails.id,
        firstName: this.userForm.get('firstName')?.value,
        lastName: this.userForm.get('lastName')?.value,
        phoneNumber: this.userForm.get('phoneNumber')?.value,
        email: this.userForm.get('email')?.value,
        dateOfBirth: this.userForm.get('dateOfBirth')?.value,
        imageUrl: this.loggedUserDetails.imageUrl,
        access: this.userForm.get('access')?.value
      };


      this.userService.updateProfile(this.userId, updatedUser, this.selectedFile)
        .subscribe(
          (response: UserModel) => {
            this.loggedUserDetails = { ...this.loggedUserDetails, ...response };
            if (response.imageUrl) {
              this.imagePreview = response.imageUrl;
            }
            this.updateSuccess = true;
            setTimeout(() => {
              this.router.navigateByUrl('back-office/dashboard');
            }, 2000);

            this.calculateProfileCompletion();
          },
          (error) => {
            console.error('Erro ao atualizar o perfil', error);
            this.updateFailure = true;
        setTimeout(() => {
          this.updateFailure = false;
        }, 2000);
          }
        );
    }
  }
}