import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('firstText', { static: true }) firstText!: ElementRef;
  @ViewChild('secondText', { static: true }) secondText!: ElementRef;
  @ViewChild('slider', { static: true }) slider!: ElementRef;

  private xPercent = 0;
  private direction = -1;
  private lastScrollTop = 0;

  @ViewChild('imageContainer') imageContainer!: ElementRef;
  @ViewChildren('imageElement') imageElements!: QueryList<ElementRef>;

  images = [
    { src: '/hover/1.jpg', alt: 'Image 1' },
    { src: '/hover/2.jpg', alt: 'Image 2' },
    { src: '/hover/3.jpg', alt: 'Image 3' },
    { src: '/hover/4.jpg', alt: 'Image 4' },
    { src: '/hover/5.jpg', alt: 'Image 5' },
  ];

  private currentImage = 0;

  constructor(private router: Router) {}

  onMouseMove(event: MouseEvent) {
    const rect = this.imageContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const imageElement = this.imageElements.toArray()[this.currentImage].nativeElement;
    imageElement.style.display = 'block';

    gsap.to(imageElement, {
      duration: 0.3,
      x: x - imageElement.offsetWidth / 2,
      y: y - imageElement.offsetHeight / 2,
      ease: 'power2.out',
    });

    this.currentImage = (this.currentImage + 1) % this.images.length;
  }

  onMouseLeave() {
    this.imageElements.forEach((img) => {
      gsap.to(img.nativeElement, {
        duration: 0.3,
        opacity: 0,
        scale: 0.8,
        onComplete: () => {
          img.nativeElement.style.display = 'none';
          img.nativeElement.style.opacity = 1;
          img.nativeElement.style.scale = 1;
        },
      });
    });
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  ngAfterViewInit(): void {
    this.initializeAnimation();
  }

  private initializeAnimation(): void {
    gsap.to(this.slider.nativeElement, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e: any) => (this.direction = e.direction * -1),
      },
      x: '-500px',
    });

    this.animate();

    // Add scale animation
    gsap.to(this.slider.nativeElement, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const scrollDirection = window.pageYOffset > this.lastScrollTop ? 1 : -1;
          this.lastScrollTop = window.pageYOffset <= 0 ? 0 : window.pageYOffset;

          if (scrollDirection > 0) {
            // Scrolling down
            gsap.to(this.slider.nativeElement, { scale: 2, duration: 0.5 });
          } else {
            // Scrolling up
            gsap.to(this.slider.nativeElement, { scale: 1, duration: 0.5 });
          }
        },
      },
    });
  }

  private animate(): void {
    if (this.xPercent < -100) {
      this.xPercent = 0;
    } else if (this.xPercent > 0) {
      this.xPercent = -100;
    }

    gsap.set(this.firstText.nativeElement, { xPercent: this.xPercent });
    gsap.set(this.secondText.nativeElement, { xPercent: this.xPercent });
    requestAnimationFrame(() => this.animate());
    this.xPercent += 0.1 * this.direction;
  }

  navigateToProperties() {
    this.router.navigate([`/properties`]); // Navigate to the property page using the id
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // This empty method is needed to trigger the scroll event
  }
}
