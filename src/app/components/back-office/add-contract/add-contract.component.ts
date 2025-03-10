import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContractType, ContractStatus, Contract } from '../../../_models/contract';
import { Property } from '../../../_models/property';
import { UserModel } from '../../../_models/user';
import { ContractService } from '../../../_services/contract.service';
import { PropertyService } from '../../../_services/property.service';
import { UserService } from '../../../_services/user.service';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrl: './add-contract.component.scss',
})
export class AddContractComponent implements OnInit {
  contractForm!: FormGroup;
  contractTypes = Object.values(ContractType);
  contractStatuses = Object.values(ContractStatus);
  properties: Property[] = [];
  selectedProperty: Property | null = null;
  errorMessage: string = '';
  loggedUserDetails: UserModel | null = null;
  userId: string = '';
  users: UserModel[] = [];
  paymentFrequencies: string[] = ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually', 'Single Payment'];
  renewalOptions: string[] = ['Automatic', 'Manual'];
  isOpen: boolean = false;
  selectedUser: UserModel | null = null;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private propertyService: PropertyService,
    private router: Router,
    private zone: NgZone,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
    this.loadUsers();

    // Quando o propertyId é alterado, atualiza a propriedade selecionada
    this.contractForm.get('propertyId')?.valueChanges.subscribe((propertyId) => {
      this.selectedProperty = this.properties.find((prop) => prop.id === propertyId) || null;

      // Se a propriedade for encontrada, preenche o valor no formulário
      if (this.selectedProperty) {
        this.contractForm.patchValue({ value: this.selectedProperty.price });
      } else {
        // Se a propriedade não for encontrada, limpa o campo de valor
        this.contractForm.patchValue({ value: null });
      }
    });

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

  selectUser(user: UserModel): void {
    this.selectedUser = user;
    this.contractForm.patchValue({ customerId: user.id }); // Preenche o formControl
  }

  loadUsers(): void {
    this.userService.retrieveNonAdmins().subscribe(
      (response: any) => {
        console.log('Response from retrieveNonAdmins:', response);

        // Acesse o array de usuários dentro do objeto de resposta
        if (response && response.users && Array.isArray(response.users)) {
          this.users = response.users; // Preenche a lista de usuários se a resposta for um array
        } else {
          console.error('Resposta não é um array ou não contém a propriedade "users":', response);
          this.users = []; // Opcional: limpar a lista se a resposta não for válida
        }
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    );
  }

  loadUserData() {
    const loggedUserString = sessionStorage.getItem('loggedUser');
    if (!loggedUserString) {
      this.router.navigateByUrl('back-office/dashboard');
      return;
    }

    const loggedUser = JSON.parse(loggedUserString);
    this.userId = loggedUser.userId; // Captura o userId do usuário logado

    this.userService.retrieve(this.userId).subscribe({
      next: (userDetails: UserModel) => {
        this.zone.run(() => {
          this.loggedUserDetails = userDetails;
          this.contractForm.patchValue({ realtorId: this.userId }); // Preenche o realtorId
        });
      },
      error: (error) => {
        console.error('Erro ao buscar detalhes do usuário:', error);
        this.errorMessage = 'Falha ao carregar os detalhes do usuário';
      },
    });
  }

  initForm(): void {
    this.contractForm = this.fb.group({
      propertyId: ['', Validators.required],
      customerId: ['', Validators.required],
      realtorId: [this.userId, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      value: [null, [Validators.required, Validators.min(0)]], // Inicializado como null
      additionalFees: ['', Validators.required],
      paymentFrequency: ['', Validators.required],
      renewalOption: [false],
      isActive: [true],
      contractType: ['', Validators.required],
      status: ['Pending', Validators.required],
      signatureDate: [new Date(), Validators.required],
      securityDeposit: [''],
      insuranceDetails: [
        'This insurance policy covers a wide range of potential damages up to a maximum of $50,000. The coverage includes liability protection, which safeguards against claims of injury and property damage caused to others. Additionally, collision coverage is provided to cover damage to the insured vehicle in the event of an accident, regardless of fault. Comprehensive coverage extends to non-collision incidents such as theft, fire, vandalism, or natural disasters. The policy also includes roadside assistance for emergencies like towing or flat tires. Please carefully review the terms and conditions for any specific exclusions, limitations, or additional coverage options that may apply. Regular premium payments are required to keep the policy active.',
        Validators.required,
      ],
      notes: ['N/A', Validators.required],
    });
  }

  onStartDateChange(event: any): void {
    const date = this.validateDateEvent(event);
    this.contractForm.patchValue({ startDate: date });
  }

  onEndDateChange(event: any): void {
    const date = this.validateDateEvent(event);
    this.contractForm.patchValue({ endDate: date });
  }

  validateDateEvent(event: any): Date {
    if (event instanceof Date) {
      return event;
    } else {
      console.error('Received invalid date event:', event);
      return new Date(); // ou retorne null, dependendo do seu caso de uso
    }
  }

  onSubmit(): void {
    console.log(this.contractForm.value);
    if (this.contractForm.valid) {
      const formValue = this.contractForm.value;
      const contractData: Contract = {
        propertyId: formValue.propertyId,
        customerId: formValue.customerId,
        realtorId: formValue.realtorId,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        value: Number(formValue.value),
        additionalFees: Number(formValue.additionalFees),
        paymentFrequency: formValue.paymentFrequency,
        renewalOption: Boolean(formValue.renewalOption),
        isActive: Boolean(formValue.isActive),
        contractType: formValue.contractType as ContractType,
        status: formValue.status as ContractStatus,
        signatureDate: new Date(formValue.signatureDate),
        securityDeposit: formValue.securityDeposit ? Number(formValue.securityDeposit) : null,
        insuranceDetails: formValue.insuranceDetails,
        notes: formValue.notes,
      };

      console.log('Contract data being sent:', contractData);

      this.contractService.createContract(contractData).subscribe(
        (response) => {
          console.log('Contrato criado com sucesso', response);
          this.router.navigateByUrl('back-office/dashboard/contracts');
        },
        (error) => {
          console.error('Erro ao criar contrato', error);
          if (error.error && error.error.errors) {
            this.errorMessage = Object.entries(error.error.errors)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');
          } else {
            this.errorMessage = 'Erro ao criar o contrato. Tente novamente.';
          }
        }
      );
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      console.log('Form invalid', this.contractForm);
    }
  }
}
