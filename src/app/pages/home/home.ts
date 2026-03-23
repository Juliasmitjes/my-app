import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../components/ui/button/button';
import { Services } from '../services/services';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Button, Services, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {
  
  scrollToContact(): void {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToServices(): void {
    const servicesSection = document.getElementById('services');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  }

}
