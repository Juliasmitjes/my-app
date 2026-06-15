import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-speech-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './speech-bubble.html',
  styleUrl: './speech-bubble.css'
})
export class SpeechBubble implements OnDestroy {
  private _text = '';

  @Input()
  set text(value: string) {
    this._text = value ?? '';
    this.startTyping(); 
  }
  get text(): string { return this._text; }

  displayedText = '';
  private typingSpeed = 80;
  private currentInterval: any;

  private startTyping() {
    if (this.currentInterval) clearInterval(this.currentInterval);
    this.displayedText = '';
    if (!this._text) return;
    let index = 0;
    this.currentInterval = setInterval(() => {
      if (index < this._text.length) {
        this.displayedText += this._text[index++];
      } else {
        clearInterval(this.currentInterval);
        this.currentInterval = undefined;
      }
    }, this.typingSpeed);
  }

  ngOnDestroy() {
    if (this.currentInterval) clearInterval(this.currentInterval);
  }
}