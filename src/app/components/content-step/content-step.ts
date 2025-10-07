import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';


@Component({
  selector: 'app-content-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-step.html',
  styleUrl: './content-step.css'
})


export class ContentStep {
  @Input() builderState!: BuilderState;
  @Input() contents: any[] = [];
  @Output() update = new EventEmitter<Partial<BuilderState>>();

  @Output() toggle = new EventEmitter<string>();

  onSelectPage(page: string) {
    this.toggle.emit(page);
}

}
