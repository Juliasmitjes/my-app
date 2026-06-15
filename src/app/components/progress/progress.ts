import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-progress',
  standalone: true, 
  imports: [CommonModule, LucideAngularModule], 
  templateUrl: './progress.html',
  styleUrl: './progress.css'
})
export class Progress {
  @Input() currentStep: number = 0;
  @Input() steps: string[] = [];
}
