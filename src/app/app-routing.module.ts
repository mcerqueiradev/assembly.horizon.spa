import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/front-office/login/login.component';
import { RegisterComponent } from './components/front-office/register/register.component';
import { ErrorComponent } from './components/error/error/error.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/front-office/front-office.module').then(
        (m) => m.FrontOfficeModule
      ),
  },
  {
    path: 'back-office',
    loadChildren: () =>
      import('./components/back-office/back-office.module').then(
        (m) => m.BackOfficeModule
      ),
  },
  { path: 'error/:type', component: ErrorComponent },
  { path: '**', redirectTo: '/error/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
