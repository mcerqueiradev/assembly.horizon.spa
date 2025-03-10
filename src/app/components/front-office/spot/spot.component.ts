import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Property } from '../../../_models/property';
import { PropertyService } from '../../../_services/property.service';
import { Router } from '@angular/router';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-spot',
  templateUrl: './spot.component.html',
  styleUrls: ['./spot.component.scss']
})
export class SpotComponent implements AfterViewInit, OnInit {
  @ViewChild('textContainer') textContainer!: ElementRef;
  @ViewChild('propertyContent', { static: true }) propertyContent!: ElementRef;

  property!: Property;

  constructor(private propertyService: PropertyService, private router : Router) {}

  ngOnInit(): void {
    this.propertyService.retrieveLatest().subscribe({
      next: (property) => {
        this.property = property;
        console.log('Propriedade:', this.property);
      },
      error: (err) => {
        console.error('Erro ao buscar a última propriedade:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.initTextRevealAnimation();
    this.initGalleryAnimation();
  }

  initTextRevealAnimation() {
    if (typeof SplitType !== 'undefined' && this.textContainer) {
      const typeSplit = new SplitType(this.textContainer.nativeElement, {
        types: 'words',
        tagName: 'span'
      });

      const words = this.textContainer.nativeElement.querySelectorAll('.word');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.textContainer.nativeElement,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.5,
          toggleActions: 'play none none reverse'
        }
      });

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

  initGalleryAnimation() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Define os itens iniciais fora da tela à direita
    gsap.set(galleryItems, { xPercent: 100, opacity: 1 });
  
    // Cria uma timeline para o carrossel
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.gallery',
        start: 'top 80%', 
        end: 'bottom top', // Mude para "bottom top" para continuar a animação até o fim
        scrub: 0.5, // Suaviza a animação
        toggleActions: 'play none none reverse'
      }
    });
  
    // Anima os itens para a esquerda conforme o scroll
    tl.to(galleryItems, {
      xPercent: -10 * (galleryItems.length - 1), // Move todos os itens para a esquerda
      duration: 1,
      ease: 'power2.out',
      stagger: {
        amount: 0.3, // Estagna as animações entre os itens
        from: 'start' // A partir do primeiro item
      }
    });
  }
  
  navigateToProperty(id: string) {
    this.router.navigate([`/property/${id}`]); // Navega para a página da propriedade usando o id
  }
}
