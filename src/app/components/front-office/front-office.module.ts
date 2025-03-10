import { NgModule } from '@angular/core';
import { AppModule } from '../../app.module';
import { LayoutComponent } from './layout/layout.component';
import { MainComponent } from './main.component';
import { SpotComponent } from './spot/spot.component';
import { PropertiesComponent } from './properties/properties.component';
import { PropertyComponent } from './property/property.component';
import { ServicesComponent } from './services/services.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { HeaderComponent } from './header/header.component';
import { AppCommonModule } from '../../common.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { ScheduleVisitComponent } from './scheduleVisit/scheduleVisit.component';
import { AddProposalComponent } from './add-proposal/add-proposal.component';
import { AllpropertiesComponent } from './allproperties/allproperties.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ProfileComponent } from './profile/profile.component';
import { TimeAgoPipe } from '../../_shared/pipes/timeAgo.pipe';

@NgModule({
  declarations: [
    LayoutComponent,
    SpotComponent,
    MainComponent,
    PropertiesComponent,
    PropertyComponent,
    ServicesComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ScheduleVisitComponent,
    AddProposalComponent,
    AllpropertiesComponent,
    ProfileComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FrontOfficeRoutingModule, AppCommonModule, GoogleMapsModule],
})
export class FrontOfficeModule {}
