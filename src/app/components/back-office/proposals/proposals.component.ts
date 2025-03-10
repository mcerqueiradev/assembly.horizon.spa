import { Component, OnInit } from '@angular/core';
import { RealtorService } from '../../../_services/realtor.service';
import { ProposalService } from '../../../_services/proposal.service';
import { AuthService } from '../../../_services/auth.service';
import { Proposal } from '../../../_models/Proposal/proposal';
import { Router } from '@angular/router';
import { UserService } from '../../../_services/user.service';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss',
})
export class ProposalsComponent implements OnInit {
  proposals: Proposal[] = [];
  loading = false;
  totalValue = 0;
  isModalOpen = false;
  notification: { type: 'success' | 'error'; message: string } | null = null;

  constructor(private authService: AuthService, private realtorService: RealtorService, private proposalService: ProposalService, private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    const loggedUser = this.authService.getLoggedUser();
    const userId = loggedUser.userId;

    this.loadProposals();
  }

  private loadProposals() {
    const loggedUser = this.authService.getLoggedUser();
    const userId = loggedUser.userId;

    this.userService.retrieve(userId).subscribe({
      next: (user) => {
        if (user.access === 'LicensedAgent') {
          this.realtorService.retrieveByUserId(userId).subscribe({
            next: (realtor) => {
              this.proposalService.getProposalsByRealtor(realtor.id).subscribe({
                next: (response) => {
                  this.proposals = response.proposals;
                },
              });
            },
          });
        } else {
          this.proposalService.getProposalsByUser(userId).subscribe({
            next: (response) => {
              this.proposals = response.proposals;
            },
          });
        }
      },
    });
  }

  private showStatusMessage(status: 'Approved' | 'Rejected'): void {
    const messages = {
      Approved: 'Proposal has been approved! The agent will prepare the contract.',
      Rejected: 'Proposal has been rejected.',
    };

    this.notification = {
      type: status === 'Approved' ? 'success' : 'error',
      message: messages[status],
    };

    setTimeout(() => {
      this.notification = null;
    }, 5000);
  }

  acceptProposalDirectly(proposalId: string) {
    this.proposalService.acceptProposalDirectly(proposalId).subscribe({
      next: () => {
        // Refresh the proposals list
        this.loadProposals();
        // Show success message (implement your preferred notification method)
        this.showStatusMessage('Approved');
      },
    });
  }

  rejectProposal(proposalId: string) {}

  viewProposalDetails(proposalId: string) {}

  calculateTotalValue(): void {
    this.totalValue = this.proposals.reduce((sum, prop) => sum + prop.proposedValue, 0);
  }

  navigateToProposal(id: string) {
    this.router.navigate([`back-office/dashboard/proposal/`, id]);
  }

  purchasePaymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer' },
    { id: 'bank_financing', name: 'Bank Financing' },
    { id: 'installments', name: 'Installments' },
    { id: 'credit_card', name: 'Credit Card' },
  ];

  rentalPaymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer' },
    { id: 'credit_card', name: 'Credit Card' },
    { id: 'direct_debit', name: 'Direct Debit' },
  ];

  getPaymentMethodName(methodId: string): string {
    const allPaymentMethods = [...this.purchasePaymentMethods, ...this.rentalPaymentMethods];
    const method = allPaymentMethods.find((m) => m.id === methodId);
    return method ? method.name : methodId;
  }
}
