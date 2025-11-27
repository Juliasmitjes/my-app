import { Component, Input, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.css']
})
export class Button {
  @Input() variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'hero' | 'outline-hero' = 'default';
  @Input() size: 'default' | 'sm' | 'lg' | 'icon' = 'default';
  @Input() disabled = false;
  @Input() class = '';
  @Input() buttonClass = '';

  @Output() clicked = new EventEmitter<Event>();

  get computedClasses() {
  const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed ' +
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
    hero: 'bg-accent text-accent-foreground hover:opacity-90 shadow-lg hover:shadow-xl hover:scale-105 transform-gpu transition-transform duration-300 ease-in-out',
    'outline-hero': 'border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent transition-all duration-300'
  };

  const sizes: Record<string, string> = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  return cn(base, variants[this.variant], sizes[this.size], this.class);
}}