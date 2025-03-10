import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Property } from '../../../_models/property';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../_services/auth.service';
import { ProposalService } from '../../../_services/proposal.service';

@Component({
  selector: 'app-add-proposal',
  templateUrl: './add-proposal.component.html',
  styleUrl: './add-proposal.component.scss',
})
export class AddProposalComponent implements OnInit {
  @Input() property: any;
  @Output() closeModal = new EventEmitter<void>();

  proposalForm: FormGroup;
  proposalSuccess = false;
  proposalFailed = false;
  errorMessage = '';

  proposalTypes = [
    { id: 0, name: 'Purchase' },
    { id: 1, name: 'Rent' }
];

  purchasePaymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer' },
    { id: 'bank_financing', name: 'Bank Financing' },
    { id: 'installments', name: 'Installments' },
    { id: 'credit_card', name: 'Credit Card' }
  ];

  rentalPaymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer' },
    { id: 'credit_card', name: 'Credit Card' },
    { id: 'direct_debit', name: 'Direct Debit' }
  ];

  get availablePaymentMethods() {
    return this.proposalForm.get('type')?.value === 'purchase' 
      ? this.purchasePaymentMethods 
      : this.rentalPaymentMethods;
  }

  constructor(private fb: FormBuilder, private authService: AuthService, private proposalService: ProposalService) {
    this.proposalForm = this.fb.group({
      proposedValue: ['', Validators.required],
      type: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      intendedMoveDate: ['', Validators.required]
    });

    this.proposalForm.get('type')?.valueChanges.subscribe(() => {
      this.proposalForm.patchValue({ paymentMethod: '' });
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit() {
    if (this.proposalForm.valid) {
      const formValue = this.proposalForm.value;
      const loggedUser = this.authService.getLoggedUser();
      
      const proposal = {
        propertyId: this.property.id,
        userId: loggedUser.userId,
        proposedValue: formValue.proposedValue,
        type: formValue.type === 'purchase' ? 0 : 1, // Map to enum values
        paymentMethod: formValue.paymentMethod,
        intendedMoveDate: new Date(formValue.intendedMoveDate).toISOString()
    };
      console.log(proposal);

      this.proposalService.createProposal(proposal).subscribe({
        next: (response) => {
          this.proposalSuccess = true;
          setTimeout(() => {
            this.proposalSuccess = true;
            this.closeModal.emit();
          }, 2000);
        },
        error: (error) => {
          this.proposalFailed = true;
          this.errorMessage = error.message || 'Failed to submit proposal';
          setTimeout(() => {
            this.proposalFailed = false;
          }, 3000);
        }
      });
    } else {
      this.proposalFailed = true;
      this.errorMessage = 'Please fill all required fields';
      setTimeout(() => {
        this.proposalFailed = false;
      }, 3000);
    }
  }

  onDateChange(event: any): void {
    const date = this.validateDateEvent(event);
    this.proposalForm.patchValue({ intendedMoveDate: date });
  }
  
  validateDateEvent(event: any): Date {
    if (event instanceof Date) {
      return event;
    }
    console.error('Received invalid date event:', event);
    return new Date();
  }
}