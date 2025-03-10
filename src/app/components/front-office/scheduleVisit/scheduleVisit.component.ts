import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Property } from '../../../_models/property';
import { Realtor } from '../../../_models/realtor';
import { UserModel } from '../../../_models/user';
import { CreatePropertyVisitCommand } from '../../../_models/PropertyVisit/createPropertyVisitCommand';
import { CreatePropertyVisitResponse } from '../../../_models/PropertyVisit/createPropertyVisitResponse';
import { VisitService } from '../../../_services/visit.service';
import { TimeSlot } from '../../../_models/PropertyVisit/TimeSlot';
import { AuthService } from '../../../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-visit',
  templateUrl: './scheduleVisit.component.html',
  styleUrl: './scheduleVisit.component.scss',
})
export class ScheduleVisitComponent implements OnInit {
  @Input() property!: Property;
  @Input() realtor!: Realtor;
  @Output() closeModal = new EventEmitter<void>();

  TimeSlot = TimeSlot;
  availableTimeSlots: TimeSlot[] = [];
  selectedTimeSlot: TimeSlot | null = null;
  errorMessage: string = '';
  visitForm: FormGroup;
  visitSuccess = false;
  visitFailed = false;
  loggedUser: any;

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService,
    private authService: AuthService,
    private router: Router
  ) {
    this.visitForm = this.fb.group({
      date: [null, Validators.required],
      timeSlot: [null, Validators.required],
      notes: ['', [Validators.maxLength(500)]],
      userId: [''],
      realtorId: ['']
    });
  }

  ngOnInit() {
    this.loggedUser = this.authService.getLoggedUser();
    this.visitForm.patchValue({
      userId: this.loggedUser?.userId,
      realtorId: this.realtor?.userId
    });
    console.log('Form Initial State:', this.visitForm.value);
  }

  selectTimeSlot(slot: TimeSlot): void {
    console.log('Selected TimeSlot:', slot);
    this.selectedTimeSlot = slot;
    this.visitForm.patchValue({ timeSlot: slot });
  }

  onSubmit(): void {
    console.log('Form Submit State:', this.visitForm.value);
    
    const user = this.authService.getLoggedUser();
    if (!user?.userId) {
      this.router.navigateByUrl('/login');
      return;
    }

    if (this.visitForm.valid && this.property.id && this.realtor.id && this.selectedTimeSlot !== null) {
      const command: CreatePropertyVisitCommand = {
        propertyId: this.property.id,
        userId: user.userId,
        realtorId: this.realtor.userId,
        visitDate: this.formatDateForApi(this.visitForm.get('date')?.value),
        timeSlot: Number(TimeSlot[this.selectedTimeSlot]),
        notes: this.visitForm.get('notes')?.value || ''
      };

      console.log('Command to be sent:', command);

      this.visitService.createVisit(command).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          this.visitSuccess = true;
          setTimeout(() => this.closeModal.emit(), 2000);
        },
        error: (error) => {
          console.log('API Error:', error);
          this.visitFailed = true;
          this.errorMessage = Object.values(error.error?.errors || {})
            .flat()
            .join(', ') || 'Error scheduling visit';
        }
      });
    }
  }

  onDateChange(date: Date): void {
    if (!date || !this.property?.id) return;
    
    this.visitForm.patchValue({ date });
    this.visitService
      .getAvailableTimeSlots(this.property.id, this.formatDateForApi(date))
      .subscribe(slots => {
        console.log('Available Slots:', slots);
        this.availableTimeSlots = slots;
        this.resetTimeSlot();
      });
  }

  private resetTimeSlot(): void {
    this.selectedTimeSlot = null;
    this.visitForm.patchValue({ timeSlot: null });
  }

  private formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}