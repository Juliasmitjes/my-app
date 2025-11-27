import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import emailjs from '@emailjs/browser';
import { BuilderState } from '../../types/builder-state';


@Component({
selector: 'app-request-popup',
standalone: true,
imports: [CommonModule, FormsModule, LucideAngularModule],
templateUrl: './request-popup.html',
})
export class RequestPopup {
@Input() visible = false;
@Input() builderState!: BuilderState;
@Output() dismiss = new EventEmitter<void>();


form = {
name: '',
company: '',
email: '',
phone: '',
message: ''
};


onDismiss() {
this.dismiss.emit();
}


async sendEmail(e: Event) {
e.preventDefault();


const templateParams = {
name: this.form.name,
company: this.form.company,
email: this.form.email,
phone: this.form.phone,
message: this.form.message,


// BuilderState data
layout: this.builderState?.layout,
colorTheme: this.builderState?.colorTheme,
fontStyle: this.builderState?.fontStyle,
fontVariant: this.builderState?.fontVariant,
fontSample: this.builderState?.fontSample,
logo: this.builderState?.logo,
navigation: this.builderState?.navigation,
headerStyle: this.builderState?.headerStyle,
pages: this.builderState?.pages?.join(', '),


price: '€250 bouwkosten + €50 per maand'
};


try {
await emailjs.send(
'service_hlgf446',
'template_prkj55o',
templateParams,
'QrIJCdETVtUM0hzai'
);

alert('Aanvraag succesvol verstuurd!');
this.visible = false;
this.dismiss.emit();
} catch (error) {
console.error('EmailJS error:', error);
alert('Er ging iets mis bij het versturen.');
}}
}