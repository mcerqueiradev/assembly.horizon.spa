import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Notification } from '../../../_models/Notification/notification';
import { NotificationResponse } from '../../../_models/Notification/notificationResponse';
import { NotificationService } from '../../../_services/notification.service';
import { take, catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.scss',
})
export class NotificationsListComponent {
  @Input() notifications: Notification[] = [];
  @Input() showNotifications: boolean = false;
  @Output() closeNotifications = new EventEmitter<void>();

  constructor(private elementRef: ElementRef,
    private notificationService: NotificationService
  ) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeNotifications.emit();
    }
  }

  async markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId)
      .pipe(
        take(1),
        catchError(error => {
          console.error('Error marking notification as read:', error);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
      });
  }
  
  getNotificationsCount(): number {
    return this.notifications.length;
  }
}