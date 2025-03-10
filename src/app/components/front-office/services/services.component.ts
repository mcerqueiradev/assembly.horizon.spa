import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements AfterViewInit {
  @ViewChildren('accordionContent') accordionContents!: QueryList<ElementRef>;
  @ViewChild('textContainer') textContainer!: ElementRef;

  services = [
    { id: 1, title: 'Tailored Market Research', content: 'We start by analyzing the current real estate market to give you the most up-to-date insights. Our team provides in-depth reports on neighborhood trends, property values, and potential investment opportunities, ensuring you make well-informed decisions.', open: false },
    { id: 2, title: 'Property Acquisition Assistance', content: 'Finding the perfect property is essential. Our agents leverage their local expertise and a wide network to identify the best properties that match your needs. From home viewings to price negotiations, we manage the entire buying process, making sure you get the best deal possible.', open: false },
    { id: 3, title: 'Expert Negotiation', content: 'Closing a real estate deal is often about the right negotiation. Our experienced negotiators work tirelessly on your behalf to secure favorable terms, ensuring you maximize the value of your investment or sale.', open: false },
    { id: 4, title: 'Marketing & Promotion for Sellers', content: 'For those selling properties, we create a customized marketing strategy to attract the right buyers. This includes professional photography, virtual tours, targeted online advertising, and property staging to present your home in its best light and get it sold quickly.', open: false },
    { id: 5, title: 'Legal & Documentation Support', content: 'We take the complexity out of real estate transactions by handling all the legal and administrative paperwork. From title verification to contract preparation and escrow management, our team ensures that every document is in order and compliant with local regulations.', open: false },
    { id: 6, title: 'Financing Solutions', content: 'Securing the right financing can be the difference between closing or losing a deal. We connect you with trusted mortgage lenders and financial advisors to help you find the best financing solutions tailored to your budget and goals.', open: false },
    { id: 7, title: 'Property Management & After-Sale Support', content: 'Once the deal is done, our services don’t stop. We offer full property management services, from tenant screening and rent collection to maintenance and repairs. Additionally, our after-sale support helps you navigate any post-transaction needs, ensuring you’re set up for long-term success.', open: false }
  ];

  constructor() {}

  ngAfterViewInit() {
    this.initializeAccordionAnimations();
    this.initTextRevealAnimation();
  }

  initTextRevealAnimation() {
    // Ensure SplitType is loaded and the textContainer is available
    if (typeof SplitType !== 'undefined' && this.textContainer) {
      // Split the text into words
      const typeSplit = new SplitType(this.textContainer.nativeElement, {
        types: 'words',
        tagName: 'span'
      });
  
      // Get all words
      const words = this.textContainer.nativeElement.querySelectorAll('.word');
  
      // Create a timeline for the animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.textContainer.nativeElement,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1, // Smooth scrubbing effect
          toggleActions: 'play none none reverse'
        }
      });
  
      // Add the animation to the timeline
      tl.fromTo(words, 
        { 
          opacity: 0, 
          filter: 'blur(10px)',
        }, 
        {
          opacity: 1, 
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out', 
          stagger: 0.1
        }
      );
  
    } else {
      console.error('SplitType is not defined or textContainer is not available.');
    }
  }

  // Função para inicializar as animações
  initializeAccordionAnimations() {
    this.accordionContents.forEach((content: ElementRef) => {
      gsap.set(content.nativeElement, { height: 0 }); // Define altura inicial como 0
    });
  }

  // Função de clique para abrir/fechar os accordions
  toggleAccordion(service: any) {
    const currentlyOpenService = this.services.find(s => s.open);
    
    // Fecha o serviço que está aberto atualmente se não for o que foi clicado
    if (currentlyOpenService && currentlyOpenService !== service) {
      this.toggleAccordion(currentlyOpenService);
    }

    service.open = !service.open;

    const contentElement = this.accordionContents.toArray()[this.services.indexOf(service)];

    if (service.open) {
      gsap.to(contentElement.nativeElement, {
        height: 'auto',
        duration: 0.5,
        ease: 'power3.inOut',
        onStart: () => {
          const scrollHeight = contentElement.nativeElement.scrollHeight; // Obtém a altura real do conteúdo
          gsap.set(contentElement.nativeElement, { height: scrollHeight }); // Define a altura antes da animação
        },
      });
    } else {
      gsap.to(contentElement.nativeElement, {
        height: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      });
    }
  }
}
