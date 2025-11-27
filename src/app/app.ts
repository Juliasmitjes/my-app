import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Toast } from './components/ui/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, RouterModule, Toast],
  templateUrl: './app.html',
})

export class App {
  protected readonly title = signal('Website Builder');
}
