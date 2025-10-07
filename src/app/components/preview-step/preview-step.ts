import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';


@Component({
  selector: 'app-preview-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-step.html',
  styleUrl: './preview-step.css'
})


export class PreviewStep {
  @Input() builderState!: BuilderState;

}
