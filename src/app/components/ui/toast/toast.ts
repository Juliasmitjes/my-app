import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-toast-container',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class Toast {
  constructor(public toast: ToastService) {}
}
