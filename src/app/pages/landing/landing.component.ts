import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe para usar *ngFor

@Component({
  selector: 'app-landing',
  imports: [CommonModule], 
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, OnDestroy { 

  images: string[] = [
    '1.png', 
    '3.png',
    '6.png',
    '4.png'
  ];

  currentIndex: number = 0;
  
  private autoSlideInterval: any; 

  constructor() {}

  ngOnInit(): void {
 
    this.startAutoSlide(); 
  }

  ngOnDestroy(): void {
  
    this.stopAutoSlide();
  }


  startAutoSlide(): void {
 
    if (this.autoSlideInterval) {
        return;
    }

    this.autoSlideInterval = setInterval(() => {
      this.nextImage();
    }, 5000); 
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null; 
    }
  }

 
  nextImage(): void {
    if (this.currentIndex === this.images.length - 1) {
      this.currentIndex = 0; 
    } else {
      this.currentIndex++;
    }
  }

  prevImage(): void {
    if (this.currentIndex === 0) {
      this.currentIndex = this.images.length - 1; 
    } else {
      this.currentIndex--;
    }
  }
}