import emailjs from '@emailjs/browser';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-request-popup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './request-popup.html',
})
export class RequestPopup {
  @Input() visible = false;
  @Input() builderState: any; // kleur, content, font, layout, navigatie etc 

  form = {
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  };

  async sendRequest() {
    const emailjs = await import('@emailjs/browser');

    const templateParams = {
      name: this.form.name,
      company: this.form.company,
      email: this.form.email,
      phone: this.form.phone,
      message: this.form.message,
      // keuzes uit builderState
      colorTheme: this.builderState?.colorTheme,
      content: this.builderState?.content,
      fontVariant: this.builderState?.fontVariant,
      layout: this.builderState?.layout,
      navigation: this.builderState?.navigation,
      // prijsinfo
      price: '€250 bouwkosten + €50 per maand'
    };

    try {
      await emailjs.send(
        'your_service_id',
        'your_template_id',
        templateParams,
        'your_public_key'
      );
      alert('Aanvraag succesvol verstuurd!');
      this.visible = false;
    } catch (error) {
      console.error('EmailJS error:', error);
      alert('Er ging iets mis bij het versturen.');
    }
  }
}