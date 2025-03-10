import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Output() dateChange = new EventEmitter<Date>();

  showDatepicker: boolean = false;
  selectedDate: Date = new Date();
  minDate: Date = new Date();

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    if (value) {
      this.selectedDate = new Date(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  toggleDatepicker(): void {
    this.showDatepicker = !this.showDatepicker;
  }

  isDateSelectable(date: Date | null): boolean {
    if (!date) return false;
    return date >= this.minDate;
}

selectDate(date: Date): void {
  if (!this.isDateSelectable(date)) return;
  
  this.selectedDate = date;
  this.onChange(date);
  this.onTouch();
  this.showDatepicker = false;
  this.dateChange.emit(date);
}

get calendarDays(): (Date | null)[] {
  const firstDay = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
  const lastDay = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0);
  
  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), i));
  }
  return days;
}

  prevMonth(): void {
    this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() - 1, 1);
  }

  nextMonth(): void {
    this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 1);
  }
  
  

// In the method where the date is selected:
  onDateSelect(date: Date) {
    this.selectDate(date);
  }
  
}