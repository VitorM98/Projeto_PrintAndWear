import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FabContactComponent } from '../../component/fab-contact/fab-contact.component';

interface Slide {
  image: string;
  text: string;
}

@Component({
  selector: 'app-tutorial',
  standalone: true, // ⬅ AGORA É STANDALONE
  imports: [
    CommonModule,
    FabContactComponent // ⬅ REGISTRADO AQUI
  ],
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {

  // Carrossel
  currentIndex = 0;
  intervalId: any;

  slides: Slide[] = [
    { image: 'texto1.png', text: '' },
    { image: 'tutorial1.png', text: 'Primeiro passo: Você vai clicar em "Início" no menu do canto superior da tela para ir direto ao chat com a Inteligência Artificial.' },
    { image: 'tutorial2.png', text: 'Depois você vai pedir ao chat para criar uma ilustração do que você quiser, pode ser de um jogo por exemplo: World of Warcraft.' },
    { image: 'tutorial3.png', text: 'Então você vai baixar a imagem que o chat gerou e salvar no seu computador, celular ou qualquer dispositivo que você estiver utilizando no momento.' },
    { image: 'tutorial4.png', text: 'Depois é só ir em "Pedido" no menu do canto superior da tela e nos enviar a imagem, escolher o modelo, cor e tamanho da sua camisa, calcular o frete de envio e realizar o pagamento e enviaremos a sua camisa personalizada!' }
  ];

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.startCarousel();
  }

  // ---------- Menu ----------
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

  // ---------- Carrossel ----------
  startCarousel() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => this.next(), 5000);
    }
  }

  pauseCarousel() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  restartInterval() {
    this.pauseCarousel();
    this.startCarousel();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.restartInterval();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.restartInterval();
  }

  onMouseDown() {
    this.pauseCarousel();
  }

  @HostListener('document:mouseup', ['$event'])
  onGlobalMouseUp(event: MouseEvent) {
    this.startCarousel();
  }

}
