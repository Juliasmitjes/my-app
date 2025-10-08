import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './label.html',
  styleUrls: ['./label.css']
})
export class Label {
  @Input() for?: string;
  @Input() text = 'string';

  // Extra Tailwind classen (zoals "text-red-500" of "mb-2")
  @Input() className = '';
}

