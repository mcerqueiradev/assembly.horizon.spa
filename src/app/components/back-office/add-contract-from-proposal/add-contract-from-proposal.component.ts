import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractType, ContractStatus } from '../../../_models/contract';
import { ContractService } from '../../../_services/contract.service';
import { UserModel } from '../../../_models/user';
import { UserService } from '../../../_services/user.service';
import { ProposalService } from '../../../_services/proposal.service';

@Component({
  selector: 'app-add-contract-from-proposal',
  templateUrl: './add-contract-from-proposal.component.html',
  styleUrl: './add-contract-from-proposal.component.scss',
})
export class AddContractFromProposalComponent implements OnInit {
  contractForm!: FormGroup;
  @Input() proposalId!: string;
  contractTypes = Object.values(ContractType);
  contractStatuses = Object.values(ContractStatus);
  paymentFrequencies: string[] = ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually', 'Single Payment'];
  errorMessage: string = '';
  loggedUserDetails: UserModel | null = null;
  userId: string = '';
  proposal: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private proposalService: ProposalService,
    private userService: UserService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
    this.loadProposalData();

    this.contractForm.get('value')?.valueChanges.subscribe((value) => {
      if (value) {
        const securityDeposit = value * 0.1;
        this.contractForm.patchValue(
          {
            securityDeposit: securityDeposit,
          },
          { emitEvent: false }
        );
      }
    });
  }

  loadProposalData() {
    this.proposalService.getProposalById(this.proposalId).subscribe({
      next: (proposal) => {
        this.proposal = proposal;
        this.contractForm.patchValue({
          proposalId: proposal.id,
          propertyId: proposal.propertyId,
          customerId: proposal.userId,
          value: proposal.proposedValue,
          startDate: proposal.intendedMoveDate,
        });

        console.log('Proposal Data:', proposal);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load proposal data';
      },
    });
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
      proposalId: [this.proposalId],
      propertyId: [''],
      customerId: [''],
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
      signatureDate: [null, Validators.required],
      securityDeposit: [''],
      insuranceDetails: [
        'This insurance policy covers a wide range of potential damages up to a maximum of $50,000. The coverage includes liability protection, which safeguards against claims of injury and property damage caused to others. Additionally, collision coverage is provided to cover damage to the insured vehicle in the event of an accident, regardless of fault. Comprehensive coverage extends to non-collision incidents such as theft, fire, vandalism, or natural disasters. The policy also includes roadside assistance for emergencies like towing or flat tires. Please carefully review the terms and conditions for any specific exclusions, limitations, or additional coverage options that may apply. Regular premium payments are required to keep the policy active.',
        Validators.required,
      ],
      notes: ['N/A', Validators.required],
    });
  }

  onSubmit(): void {
    if (!this.contractForm.valid) {
      return;
    }

    const formValue = this.contractForm.value;
    const contractData = {
      proposalId: this.proposalId,
      propertyId: this.proposal.propertyId,
      customerId: formValue.customerId,
      realtorId: this.userId,
      startDate: new Date(formValue.startDate),
      endDate: new Date(formValue.endDate),
      value: Number(formValue.value),
      additionalFees: Number(formValue.additionalFees),
      paymentFrequency: formValue.paymentFrequency,
      renewalOption: Boolean(formValue.renewalOption),
      isActive: true,
      contractType: formValue.contractType as ContractType,
      status: formValue.status as ContractStatus,
      signatureDate: new Date(formValue.signatureDate),
      securityDeposit: Number(formValue.securityDeposit),
      insuranceDetails: formValue.insuranceDetails,
      notes: formValue.notes,
    };

    this.contractService.createContractFromProposal(contractData).subscribe({
      next: (response) => {
        this.router.navigateByUrl('back-office/dashboard/contracts');
      },
      error: (error) => {
        this.errorMessage = 'Failed to create contract';
      },
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
}
