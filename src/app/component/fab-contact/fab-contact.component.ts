import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-fab-contact',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <!-- FAB principal -->
    <button
      mat-fab
      color="primary"
      [matMenuTriggerFor]="contactMenu"
      class="fab-contact-button"
    >
      <mat-icon>chat</mat-icon>
    </button>

    <!-- MENU -->
    <mat-menu #contactMenu="matMenu" class="contactMenu">

      <!-- WHATSAPP -->
      <button mat-menu-item (click)="openLink('whatsapp')">
        <mat-icon svgIcon="whatsapp" class="whats-icon"></mat-icon>
        <span class="label">WhatsApp</span>
      </button>

      <!-- EMAIL -->
      <button mat-menu-item (click)="openLink('email')">
        <mat-icon>email</mat-icon>
        <span class="label">Email</span>
      </button>

    </mat-menu>
  `,
  styleUrl: './fab-contact.component.css'
})
export class FabContactComponent {

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'whatsapp',
      this.sanitizer.bypassSecurityTrustResourceUrl('whatsapp-svgrepo-com.svg')
    );
  }

  openLink(type: 'whatsapp' | 'email' | 'phone') {
    const whatsappNumber = '9999999999999';
    const emailAddress = 'seuemail@exemplo.com';
    const phoneNumber = '11999999999';

    if (type === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Olá!`, '_blank');
    } else if (type === 'email') {
      window.location.href = `mailto:${emailAddress}`;
    } else if (type === 'phone') {
      window.location.href = `tel:${phoneNumber}`;
    }
  }
}
