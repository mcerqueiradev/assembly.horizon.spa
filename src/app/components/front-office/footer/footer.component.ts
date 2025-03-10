import { Component, OnInit, ElementRef } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit() {
    this.initAnimations();
  }

  private initAnimations() {
    // Hero Title Animation
    gsap.from('.footer-title span', {
      y: 200,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.footer-title',
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
    });

    // CTA Buttons Animation
    gsap.from('.footer-cta button', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)',
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.footer-cta',
        start: 'top center+=100',
        toggleActions: 'play none none reverse',
      },
    });

    // Contact Cards Animation
    gsap.from('.contact-card', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.footer-grid',
        start: 'top center+=100',
        toggleActions: 'play none none reverse',
      },
    });

    // Newsletter Section Animation
    gsap.from('.newsletter-section', {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '.newsletter-section',
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
    });

    // Footer Links Stagger Animation
    gsap.from('.footer-links .space-y-6', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.footer-links',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse',
      },
    });
  }
}
