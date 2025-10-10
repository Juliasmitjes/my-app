import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../components/ui/button/button';
import { LucideAngularModule } from 'lucide-angular';
import { Services } from '../services/services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Button, LucideAngularModule, Services],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home implements AfterViewInit{
  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  scrollToContact(): void {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToServices(): void {
    const servicesSection = document.getElementById('services');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  }

}
