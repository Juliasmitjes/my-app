import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private counter = 0;

  private add(type: ToastMessage['type'], text: string) {
    const newToast: ToastMessage = {
      id: this.counter++,
      type,
      text
    };

    const current = this.messagesSubject.getValue();
    this.messagesSubject.next([...current, newToast]);

    // auto-remove
    setTimeout(() => this.remove(newToast.id), 4000);
  }

  remove(id: number) {
    const current = this.messagesSubject.getValue();
    this.messagesSubject.next(current.filter(m => m.id !== id));
  }

  success(text: string) {
    this.add('success', text);
  }

  error(text: string) {
    this.add('error', text);
  }

  info(text: string) {
    this.add('info', text);
  }
}
