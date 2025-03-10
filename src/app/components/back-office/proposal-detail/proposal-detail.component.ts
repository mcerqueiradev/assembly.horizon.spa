import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from '../../../_services/proposal.service';
import { Proposal, ProposalStatus } from '../../../_models/Proposal/proposal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../_services/auth.service';
import { TimelineEvent } from '../../../_models/Proposal/timelineEvent';
import { PropertyNegotiationService } from '../../../_services/propertyNegotiation.service';
import { Negotiation } from '../../../_models/Negotiation/negotiation';
import { NegotiationCommand } from '../../../_models/Negotiation/negotiationCommand';
import { UserModel } from '../../../_models/user';
import { UserService } from '../../../_services/user.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail.component.html',
  styleUrl: './proposal-detail.component.scss',
})
export class ProposalDetailComponent implements OnInit {
  proposal: Proposal = {} as Proposal;
  loggedUserDetails: UserModel = {} as UserModel;
  negotiationForm: FormGroup;
  replyForm: FormGroup;
  currentUserId: string = '';
  proposalTimeline: TimelineEvent[] = [];
  negotiations: Negotiation[] = [];
  timelineIcons: { [key: string]: SafeHtml } = {};
  showContractModal = false;
  notification: { type: 'success' | 'error'; message: string } | null = null;
  private readonly statusClasses: Record<ProposalStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    UnderAnalysis: 'bg-orange-100 text-orange-800',
    InNegotiation: 'bg-blue-100 text-blue-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Cancelled: 'bg-gray-100 text-gray-800',
    Completed: 'bg-purple-100 text-purple-800',
  };

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

  private readonly accessDisplayNames: Record<string, string> = {
    UnassignedAccount: 'Unassigned Account',
    GuestVisitor: 'Guest Visitor',
    RegisteredClient: 'Registered Client',
    LicensedAgent: 'Licensed Agent',
    SystemAdministrator: 'System Administrator',
    SuspendedUser: 'Suspended User',
  };

  getDocumentTypeName(type: string): string {
    const documentTypeNames: Record<string, string> = {
      Contract: 'Contract',
      Identification: 'Identification',
      ProofOfIncome: 'Proof of Income',
      BankStatement: 'Bank Statement',
      PropertyDocument: 'Property Document',
      Other: 'Other',
    };

    return documentTypeNames[type] || 'Unknown Document';
  }

  constructor(
    private fb: FormBuilder,
    private proposalService: ProposalService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private propertyNegotiationService: PropertyNegotiationService,
    private userService: UserService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.negotiationForm = this.fb.group({
      proposalId: [''],
      senderId: [''],
      message: ['', Validators.required],
      counterOffer: [null, [Validators.min(0)]],
      documents: [[]],
    });

    this.replyForm = this.fb.group({
      proposalId: [''],
      senderId: [''],
      message: ['', Validators.required], // This matches what we defined
      counterOffer: [null, [Validators.min(0)]],
      documents: [[]],
    });
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getLoggedUser().userId;
    this.userService.retrieve(this.currentUserId).subscribe({
      next: (user) => {
        this.loggedUserDetails = user;
        this.loadProposal();
        this.loadNegotiations();
      },
    });
    this.loadProposal();
    this.loadNegotiations();
    this.initializeIcons();
  }

  private loadProposal(): void {
    this.route.params.pipe(switchMap((params) => this.proposalService.getProposalById(params['id']))).subscribe({
      next: (proposal) => {
        this.proposal = proposal;
        this.generateTimeline();
      },
      error: (error) => {
        console.error('Error loading proposal:', error);
        // Aqui você pode adicionar uma lógica de tratamento de erro
      },
    });
  }

  private loadNegotiations(): void {
    this.route.params.subscribe((params) => {
      const proposalId = params['id'];
      this.propertyNegotiationService.getNegotiationsByProposal(proposalId).subscribe({
        next: (negotiations) => {
          this.negotiations = negotiations;
          console.log(negotiations);
          this.generateTimeline();
        },
        error: (error) => {
          console.error('Error loading negotiations:', error);
        },
      });
    });
  }

  generateTimeline() {
    if (!this.proposal) return;

    this.proposalTimeline = [
      {
        date: new Date(this.proposal.createdAt),
        title: 'Proposal Created',
        description: `Proposal ${this.proposal.proposalNumber} created by ${this.proposal.userName}`,
        type: 'status',
        status: 'created',
        icon: 'document-add',
      },
    ];

    // Add status changes
    if (this.proposal.status === 'UnderAnalysis') {
      this.proposalTimeline.push({
        date: new Date(this.proposal.updatedAt),
        title: 'Under Analysis',
        description: 'Proposal is being analyzed by the agent',
        type: 'status',
        status: 'analysis',
        icon: 'search',
      });
    }

    if (this.proposal.status === 'InNegotiation') {
      this.proposalTimeline.push({
        date: new Date(this.proposal.updatedAt),
        title: 'Negotiation Started',
        description: 'Proposal entered negotiation phase',
        type: 'status',
        status: 'negotiation',
        icon: 'currency-dollar',
      });
    }

    // Add negotiations
    this.negotiations.forEach((negotiation) => {
      this.proposalTimeline.push({
        date: new Date(negotiation.createdAt),
        title: 'New Negotiation',
        description: negotiation.message,
        type: 'negotiation',
        icon: 'chat',
        counterOffer: negotiation.counterOffer,
      });
    });

    // Add documents
    this.proposal.documents?.forEach((document) => {
      this.proposalTimeline.push({
        date: new Date(document.createdAt || Date.now()),
        title: 'Document Attached',
        description: document.documentName,
        type: 'document',
        icon: 'document',
      });
    });

    if (this.proposal.status === 'Approved' || this.proposal.status === 'Completed') {
      // Add Approved event
      this.proposalTimeline.push({
        date: new Date(this.proposal.updatedAt),
        title: 'Proposal Approved',
        description: 'Proposal has been approved by all parties',
        type: 'status',
        status: 'approved',
        icon: 'check-circle',
      });
    }

    // Add Completed event if status is Completed
    if (this.proposal.status === 'Completed') {
      this.proposalTimeline.push({
        date: new Date(this.proposal.updatedAt),
        title: 'Negotiation Completed',
        description: 'Negotiation process has been successfully completed',
        type: 'status',
        status: 'completed',
        icon: 'check-circle',
      });
    }
    if (this.proposal.status === 'Rejected') {
      this.proposalTimeline.push({
        date: new Date(this.proposal.updatedAt),
        title: 'Proposal Rejected',
        description: 'Proposal was rejected',
        type: 'status',
        status: 'rejected',
        icon: 'x-circle',
      });
    }

    if (this.proposal.status === 'Cancelled') {
      this.proposalTimeline.push({
        date: new Date(this.proposal.updatedAt),
        title: 'Proposal Cancelled',
        description: 'Proposal was cancelled',
        type: 'status',
        status: 'cancelled',
        icon: 'ban',
      });
    }

    this.proposalTimeline = this.proposalTimeline
      .map((item) => ({
        ...item,
        date: item.date ? new Date(item.date) : new Date(),
      }))
      .filter((item) => !isNaN(item.date.getTime()));

    // Sort timeline by date
    this.proposalTimeline.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private initializeIcons(): void {
    const icons: Record<string, string> = {
      'document-add': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>
`,
      search: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>
`,
      'currency-dollar': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
`,
      chat: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
</svg>`,
      document: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>
`,
      'check-circle': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
`,
      'x-circle': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
`,
      ban: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
</svg>`,
    };

    Object.keys(icons).forEach((key) => {
      this.timelineIcons[key] = this.sanitizer.bypassSecurityTrustHtml(icons[key]);
    });
  }

  submitReply(): void {
    if (this.replyForm.valid && this.proposal) {
      const files: File[] = this.replyForm.get('documents')?.value || [];
      const documentTypes = files.length > 0 ? files.map((file) => this.getDocumentType(file.type)) : [];

      const command: NegotiationCommand = {
        proposalId: this.proposal.id,
        senderId: this.currentUserId,
        message: this.replyForm.get('message')?.value,
        counterOffer: this.replyForm.get('counterOffer')?.value,
        documents: files,
        documentTypes: documentTypes,
      };

      this.propertyNegotiationService.createNegotiation(this.proposal.id, command).subscribe({
        next: (result) => {
          // First load the updated proposal to get the new status
          this.loadProposal();

          // Then proceed with the rest of the logic
          this.loadNegotiations();
          this.replyForm.reset();
        },
        error: (error) => {
          console.error('Error submitting reply:', error);
          this.notification = {
            type: 'error',
            message: 'Failed to submit reply. Please try again.',
          };
        },
      });
    }
  }

  private getDocumentType(mimeType: string): number {
    const typeMap: { [key: string]: number } = {
      'application/pdf': 0,
      'image/jpeg': 1,
      'image/png': 1,
      'application/msword': 2,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 2,
    };

    return typeMap[mimeType] || 3;
  }

  canShowActionButtons(): boolean {
    const isAgent = this.loggedUserDetails?.access === 'LicensedAgent';
    const isActionableStatus = ['Pending', 'Negotiating'].includes(this.proposal?.status);
    const isOwner = this.proposal?.userId === this.loggedUserDetails?.id;

    return isActionableStatus && (isAgent || isOwner);
  }

  // Method to show status messages
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

  // Action methods stay the same
  acceptProposal(negotiationId: string) {
    this.proposalService.acceptProposal(this.proposal.id, negotiationId).subscribe({
      next: () => {
        this.loadProposal();
        this.showStatusMessage('Approved');
      },
    });
  }

  rejectProposal(negotiationId: string) {
    this.proposalService.rejectProposal(this.proposal.id, negotiationId).subscribe({
      next: () => {
        this.loadProposal();
        this.showStatusMessage('Rejected');
      },
    });
  }

  canCreateContract(): boolean {
    return this.proposal.status === 'Approved' && this.loggedUserDetails?.access === 'LicensedAgent';
  }

  openContractModal() {
    this.showContractModal = true;
  }

  closeContractModal() {
    this.showContractModal = false;
  }

  onFileSelect(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList) {
      const files = Array.from(fileList);
      this.negotiationForm.patchValue({ documents: files });
      this.replyForm.patchValue({ documents: files });
    }
  }

  getStatusClass(): string {
    if (!this.proposal?.status) {
      return '';
    }

    const baseClasses = 'px-3 py-1 rounded-full text-sm';
    const statusClass = this.statusClasses[this.proposal.status as ProposalStatus] || 'bg-gray-100 text-gray-800';

    return `${baseClasses} ${statusClass}`;
  }

  getPaymentMethodName(methodId: string): string {
    const allPaymentMethods = [...this.purchasePaymentMethods, ...this.rentalPaymentMethods];
    const method = allPaymentMethods.find((m) => m.id === methodId);
    return method ? method.name : methodId;
  }

  isCurrentUserSender(senderId: string): boolean {
    return senderId === this.currentUserId;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  getAccessDisplayName(access: string): string {
    return this.accessDisplayNames[access] || access;
  }
}
