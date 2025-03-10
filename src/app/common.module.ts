import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './components/common/logo/logo.component';
import { DatepickerComponent } from './components/common/datepicker/datepicker.component';
import { CommentsComponent } from './components/common/comments/comments.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './components/common/calendar/calendar.component';
import { TimeAgoPipe } from './_shared/pipes/timeAgo.pipe';

@NgModule({
  declarations: [LogoComponent, DatepickerComponent, CommentsComponent, CalendarComponent, TimeAgoPipe],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [LogoComponent, DatepickerComponent, CommentsComponent, CalendarComponent, TimeAgoPipe],
})
export class AppCommonModule {}
