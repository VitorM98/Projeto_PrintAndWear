import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FabContactComponent } from '../../component/fab-contact/fab-contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule,FabContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  messages: { role: string, content?: string, image?: string }[] = [];
  userInput: string = "";

  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  // --------------------------
  // MENU E LOGOUT
  // --------------------------

  toggleMenu(): void {
    const menu = document.getElementById('menuModal');
    const btn = document.getElementById('btn-menu');
    const overlay = document.getElementById('overlay');

    menu?.classList.toggle('ativo');
    btn?.classList.toggle('ativo');
    overlay?.classList.toggle('ativo');
  }

  logout(): void {
    this.authService.logout();
  }

  fecharBoasVindas(): void {
    const caixa = document.getElementById('boasVindas');
    if (caixa) caixa.style.display = 'none';
  }

  // --------------------------
  // ENVIO DE TEXTO
  // --------------------------

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    this.messages.push({ role: 'user', content: this.userInput });

    const prompt = this.userInput;
    this.userInput = "";

    this.chatService.sendMessage(prompt).subscribe({
      next: (res: any) => {
        const reply = res.choices[0].message.content;
        this.messages.push({ role: 'assistant', content: reply });
      },
      error: (err: any) => {
        console.error("Erro na API:", err);
        this.messages.push({
          role: 'assistant',
          content: "❌ Erro ao contactar o servidor."
        });
      }
    });
  }

  // --------------------------
  // ENVIO DE IMAGEM
  // --------------------------

  sendImage(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    // Mostra imagem no chat do usuário imediatamente
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.messages.push({
        role: 'user',
        image: fileReader.result as string
      });
    };
    fileReader.readAsDataURL(file);

    // Envia para o servidor
    this.chatService.sendImage(file).subscribe({
      next: (res: any) => {
        const reply = res.choices[0].message.content;
        this.messages.push({ role: 'assistant', content: reply });
      },
      error: (err: any) => {
        console.error("Erro ao enviar imagem:", err);
        this.messages.push({
          role: 'assistant',
          content: "❌ Erro ao enviar imagem."
        });
      }
    });
  }
}
