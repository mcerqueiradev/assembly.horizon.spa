import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionService } from '../../../_services/transaction.service';
import { Transaction } from '../../../_models/Transaction/transaction';

@Component({
  selector: 'app-process-payment',
  templateUrl: './process-payment.component.html',
  styleUrl: './process-payment.component.scss',
})
export class ProcessPaymentComponent implements OnInit {
  @Input() transaction!: Transaction;
  @Output() closeModal = new EventEmitter<void>();

  paymentForm: FormGroup;
  paymentSuccess: boolean = false;
  paymentFailure: boolean = false;
  errorMessage: string = '';

  paymentMethods: { id: string; name: string }[] = [
    { id: 'credit_card', name: 'Credit Card' },
    { id: 'debit_card', name: 'Debit Card' },
    { id: 'bank_transfer', name: 'Bank Transfer' },
    { id: 'paypal', name: 'PayPal' },
  ];

  constructor(private fb: FormBuilder, private transactionService: TransactionService) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      amount: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    if (this.transaction) {
      this.paymentForm.patchValue({
        amount: this.transaction.amount,
        description: this.transaction.description,
      });
    }
  }

  processPayment() {
    if (this.paymentForm.valid) {
      const paymentData = {
        transactionId: this.transaction.id,
        paymentMethod: this.paymentForm.get('paymentMethod')?.value,
      };

      this.transactionService.processPayment(paymentData).subscribe({
        next: (response) => {
          this.paymentSuccess = true;
          setTimeout(() => {
            this.closeModal.emit();
          }, 2000);
        },
        error: (error) => {
          console.error('Payment failed:', error);
          this.paymentFailure = true;
          this.errorMessage = 'Payment processing failed. Please try again.';
        },
      });
    }
  }
}
