import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ContractComponent } from './contract/contract.component';
import { ContractsComponent } from './contracts/contracts.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { AddContractComponent } from './add-contract/add-contract.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackOfficeRoutingModule } from './back-office-routing.module';
import { TransactionsComponent } from './transactions/transactions.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { AppCommonModule } from '../../common.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { TimeSlotPipe } from '../../_shared/pipes/timeSlot.pipe';
import { ProposalsComponent } from './proposals/proposals.component';
import { ProposalDetailComponent } from './proposal-detail/proposal-detail.component';
import { AddContractFromProposalComponent } from './add-contract-from-proposal/add-contract-from-proposal.component';
import { ProcessPaymentComponent } from './process-payment/process-payment.component';
import { DashPropertiesComponent } from './dash-properties/dash-properties.component';
import { BaseChartDirective } from 'ng2-charts';
import { UserAdministrationComponent } from './userAdministration/userAdministration.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SettingsComponent,
    ContractComponent,
    ContractsComponent,
    AddContractComponent,
    AddPropertyComponent,
    TransactionsComponent,
    AddTransactionComponent,
    SidebarComponent,
    NotificationsListComponent,
    InvoiceComponent,
    TimeSlotPipe,
    ProposalsComponent,
    ProposalDetailComponent,
    AddContractFromProposalComponent,
    ProcessPaymentComponent,
    DashPropertiesComponent,
    UserAdministrationComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BackOfficeRoutingModule, AppCommonModule, BaseChartDirective],
  exports: [TimeSlotPipe],
})
export class BackOfficeModule {}
