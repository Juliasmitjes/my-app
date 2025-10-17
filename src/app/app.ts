import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
})

export class App {
  protected readonly title = signal('Website Builder');
}
