import { Pipe, type PipeTransform } from '@angular/core';
import { TimeSlot } from '../../_models/PropertyVisit/TimeSlot';

@Pipe({
  name: 'appTimeSlot',
})
export class TimeSlotPipe implements PipeTransform {
  transform(value: TimeSlot): string {
      switch(value) {
          case TimeSlot.Morning_8AM: return '08:00 - 09:00';
          case TimeSlot.Morning_9AM: return '09:00 - 10:00';
          case TimeSlot.Morning_10AM: return '10:00 - 11:00';
          case TimeSlot.Morning_11AM: return '11:00 - 12:00';
          case TimeSlot.Afternoon_2PM: return '14:00 - 15:00';
          case TimeSlot.Afternoon_3PM: return '15:00 - 16:00';
          case TimeSlot.Afternoon_4PM: return '16:00 - 17:00';
          case TimeSlot.Afternoon_5PM: return '17:00 - 18:00';
          default: return '';
      }
  }
}