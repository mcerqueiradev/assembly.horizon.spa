import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  @Input() events: any[] = [];
  @Output() daySelected = new EventEmitter<Date>();

  currentDate: Date = new Date();
  selectedDate: Date | null = null;

  get currentMonth(): string {
    return this.currentDate.toLocaleString('default', { month: 'long' });
  }

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  get calendarDays(): (Date | null)[] {
    const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

    const days: (Date | null)[] = [];

    // Add empty days for the start of the month
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i));
    }

    return days;
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
  }

  selectDate(date: Date | null): void {
    if (date) {
      this.selectedDate = date;
      this.daySelected.emit(date);
    }
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  hasEvents(date: Date | null): boolean {
    if (!date || !this.events) return false;
    return this.events.some((event) => new Date(event.date).toDateString() === date.toDateString());
  }
}
