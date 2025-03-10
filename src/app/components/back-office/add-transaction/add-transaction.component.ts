import { Component, EventEmitter, NgZone, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from '../../../_services/contract.service';
import { ContractResponse } from '../../../_models/contractResponse';
import { TransactionService } from '../../../_services/transaction.service';
import { AuthService } from '../../../_services/auth.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  transactionForm: FormGroup;
  contracts: ContractResponse[] = []; // Usar ContractResponse[] que traz os dados completos
  selectedContract: ContractResponse | null = null;
  errorMessage: string = '';
  paymentMethods: { id: string; name: string }[] = [
    { id: 'credit_card', name: 'Credit Card' },
    { id: 'debit_card', name: 'Debit Card' },
    { id: 'bank_transfer', name: 'Bank Transfer' },
    { id: 'paypal', name: 'PayPal' },
  ];

  transactionSuccess: boolean = false;
  transactionFailure: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private contractService: ContractService,
    private transactionService: TransactionService,
    private authService : AuthService,
    private zone: NgZone
  ) {
    this.transactionForm = this.fb.group({
      contractId: ['', Validators.required],
      amount: [ [Validators.required, Validators.min(0)]],
      description: [''],
      paymentMethod: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadContracts();

  this.transactionForm.get('contractId')?.valueChanges.subscribe((contractId) => {
    if (this.contracts) {
      this.selectedContract = this.contracts.find(contract => contract.id === contractId) || null;

      if (this.selectedContract) {
        this.transactionForm.patchValue({
          amount: this.selectedContract.value
        });
      } else {
        this.transactionForm.patchValue({
          amount: null
        });
      }
    }
  });
  }
  
  loadContracts(): void {
    this.contractService.retrieveAll().subscribe({
      next: (response: any) => {
        this.zone.run(() => {
          // Verifica se a resposta possui a propriedade 'contracts'
          if (response && response.contracts) {
            this.contracts = response.contracts;
            console.log(this.contracts);
          } else {
            console.error('Resposta inválida do servidor');
            this.errorMessage = 'Formato inesperado dos dados de contratos.';
          }
        });
      },
      error: (error) => {
        console.error('Erro ao buscar contratos:', error);
        this.errorMessage = 'Falha ao carregar a lista de contratos.';
      }
    }
    );
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const transactionData = this.transactionForm.value;
      const userId = this.authService.getLoggedUser().userId; // Assumindo que getLoggedUser() retorna um objeto com uma propriedade 'id'
      // Adiciona o userId aos dados da transação
      const completeTransactionData = {
        ...transactionData,
        userId: userId
      };

      console.log(userId)
      console.log(completeTransactionData)
      console.log(transactionData)
  
      this.transactionService.createTransaction(completeTransactionData).subscribe({
        next: (response) => {
          console.log('Transaction created successfully:', response);
          this.transactionSuccess = true;
          setTimeout(() => {
            this.closeModal.emit();
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating transaction:', error);
          this.errorMessage = 'Failed to create transaction. Please try again.';
          this.transactionFailure = true;
        }
      });
    } else {
      console.log('Form is not valid');
      this.errorMessage = 'Please fill all required fields correctly.';
    }
  }
}
