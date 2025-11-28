import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./pages/login/login.component";
import { FabContactComponent } from './component/fab-contact/fab-contact.component';

@Component({
  selector: 'app-root',
  standalone: true, // Adicionado se não estiver presente (necessário em projetos novos)
  imports: [
    RouterOutlet,
    LoginComponent,
    FabContactComponent // 2. Adiciona o componente FAB à lista de imports
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sprint_7';
}