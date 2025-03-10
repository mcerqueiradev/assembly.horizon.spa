import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContractComponent } from './add-contract/add-contract.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { ContractComponent } from './contract/contract.component';
import { ContractsComponent } from './contracts/contracts.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { ProposalDetailComponent } from './proposal-detail/proposal-detail.component';
import { DashPropertiesComponent } from './dash-properties/dash-properties.component';
import { UserAdministrationComponent } from './userAdministration/userAdministration.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'addproperty',
        component: AddPropertyComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'contracts',
        component: ContractsComponent,
      },
      {
        path: 'contracts/add-contract',
        component: AddContractComponent,
      },
      {
        path: 'contract/:id',
        component: ContractComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'invoices/:id',
        component: InvoiceComponent,
      },
      {
        path: 'proposals',
        component: ProposalsComponent,
      },
      {
        path: 'proposal/:id',
        component: ProposalDetailComponent,
      },
      {
        path: 'properties',
        component: DashPropertiesComponent,
      },
      {
        path: 'users',
        component: UserAdministrationComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackOfficeRoutingModule {}
