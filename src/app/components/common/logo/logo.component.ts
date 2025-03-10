import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  @HostBinding('class') class = 'h-full w-auto';
}
