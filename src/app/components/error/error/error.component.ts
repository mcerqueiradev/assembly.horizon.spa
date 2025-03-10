import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent implements OnInit {
  errorMessage: string;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.errorMessage = '';
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const errorType = params['type'];
      this.setErrorMessage(errorType);
    });

    this.route.queryParams.subscribe((params) => {
      const name = params['name'];
      console.log(name);
    });
  }

  goBack() {
    if (this.canGoBack()) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  private canGoBack(): boolean {
    return this.location.getState() !== null;
  }

  private setErrorMessage(errorType: string) {
    switch (errorType) {
      case 'notfound':
        this.errorMessage = 'Page not found.';
        break;
      default:
        break;
    }
  }
}
