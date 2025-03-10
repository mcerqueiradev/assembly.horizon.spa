import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { TransactionsResponse } from '../../../_models/Transaction/transactionsResponse';
import { TransactionService } from '../../../_services/transaction.service';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../_services/invoice.service';
import { Transaction } from '../../../_models/Transaction/transaction';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  transactionsResponse: TransactionsResponse = { transactions: [] };
  selectedTransaction: Transaction | null = null;
  errorMessage: string = '';
  paymentMethods: { id: string; name: string }[] = [
    { id: 'credit_card', name: 'Credit Card' },
    { id: 'debit_card', name: 'Debit Card' },
    { id: 'bank_transfer', name: 'Bank Transfer' },
    { id: 'paypal', name: 'PayPal' },
  ];
  isFilterMenuOpen = false;
  currentStatusFilter = 'Completed';

  constructor(private transactionService: TransactionService, private invoiceService: InvoiceService, private authService: AuthService, private zone: NgZone, private router: Router) {}

  ngOnInit(): void {
    const loggedUser = this.authService.getLoggedUser();

    if (loggedUser) {
      this.transactionService.getTransactionsByUser(loggedUser.userId).subscribe({
        next: (response: TransactionsResponse) => {
          this.zone.run(() => {
            this.transactionsResponse = response;
            console.log('Transactions:', this.transactionsResponse.transactions);
          });
        },
        error: (error) => {
          console.error('Erro ao buscar transactions:', error);
          this.errorMessage = 'Falha ao carregar transactions';
        },
      });
    }
  }

  isNewTransactionModalOpen = false;
  isPaymentModalOpen = false;

  openNewTransactionModal() {
    this.isNewTransactionModalOpen = true;
  }

  closeNewTransactionModal() {
    this.isNewTransactionModalOpen = false;
  }

  openPaymentModal(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.isPaymentModalOpen = true;
  }

  closePaymentModal() {
    this.selectedTransaction = null;
    this.isPaymentModalOpen = false;
  }

  formatNumber(value: number): string {
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + 'm'; // For millions
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + 'k'; // For thousands
    }
    return value.toString(); // For values less than 1000
  }

  transactionValue(): number {
    return this.transactionsResponse.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  getPaymentMethodName(methodId: string): string {
    const method = this.paymentMethods.find((pm) => pm.id === methodId);
    return method ? method.name : methodId;
  }

  viewInvoiceDetails(invoiceId: string) {
    this.invoiceService.getInvoice(invoiceId).subscribe({
      next: (invoice) => {
        this.router.navigate(['/back-office/dashboard/invoices', invoiceId], {
          state: { invoice },
        });
      },
      error: (error) => {
        console.error('Error fetching invoice:', error);
      },
    });
  }

  filterTransactionsByStatus(status: string) {
    this.currentStatusFilter = status;
    this.isFilterMenuOpen = false;
  }

  get upcomingTransactions() {
    return this.transactionsResponse.transactions
      .filter((t) => t.status === 'Pending')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }

  toggleFilterMenu() {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  get filteredTransactions() {
    if (this.currentStatusFilter === 'all') {
      return this.transactionsResponse.transactions;
    }
    return this.transactionsResponse.transactions.filter((t) => t.status === this.currentStatusFilter);
  }
}
