import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-speech-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './speech-bubble.html',
  styleUrl: './speech-bubble.css'
})
export class SpeechBubble implements OnInit {
  displayedText = '';
  private fullText = 'Kies jouw stijl!';
  private typingSpeed = 100; 

  ngOnInit() {
    this.startTyping();
  }

  private startTyping() {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.fullText.length) {
        this.displayedText += this.fullText[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, this.typingSpeed);
  }
}