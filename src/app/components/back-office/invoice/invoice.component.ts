import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceResponse } from '../../../_models/Invoice/invoiceResponse';
import { InvoiceService } from '../../../_services/invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent implements OnInit {
  invoice: InvoiceResponse | undefined;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { invoice: InvoiceResponse };
    if (state) {
      this.invoice = state.invoice;
    }
  }

  ngOnInit() {
    if (!this.invoice) {
      const invoiceId = this.route.snapshot.params['id'];
      this.invoiceService.getInvoice(invoiceId).subscribe({
        next: (response) => {
          this.invoice = response;
        },
        error: (error) => {
          console.error('Error loading invoice:', error);
        }
      });
    }
  }
  
  calculateBreakdown(totalAmount: number | undefined, contractType: string | undefined, securityDeposit: number | null | undefined) {
    const amount = totalAmount || 0;
    const type = contractType?.toLowerCase() || 'rent';
    const deposit = securityDeposit || 0;
    
    if (type === 'rent') {
      return {
        baseRent: amount * 0.70,
        utilities: amount * 0.15,
        maintenanceFee: amount * 0.05,
        securityDeposit: deposit
      };
    }
    
    return {
      downPayment: amount * 0.15,
      mortgagePayment: amount * 0.70,
      closingCosts: amount * 0.05,
      securityDeposit: deposit
    };
  }

  formatCurrency(value: number | undefined): string {
    return (value ?? 0).toFixed(2);
  }
}