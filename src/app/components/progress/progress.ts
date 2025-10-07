import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './progress.html',
  styleUrl: './progress.css'
})
export class Progress {
  @Input() currentStep: number = 0;
  @Input() steps: string[] = [];
}
