import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';


interface User {
  username?: string;
  fullname?: string;
  birthdate?: string;
  email?: string;
  telefone?: string;
  senha?: string;
  confirmaSenha?: string;
  termos?: boolean;
}

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, FormsModule], 
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css',
  standalone: true 
})
export class CadastroComponent {

 
  user: User = {};

  passwordMismatch: boolean = false;

  showPassword = false;
  showConfirmPassword = false;

  constructor() {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(form: any): void {
    if (form.valid) {
      if (this.user.senha !== this.user.confirmaSenha) {
        this.passwordMismatch = true;
        alert("Erro: As senhas não coincidem.");
        return; 
      }

      this.passwordMismatch = false; 

      console.log('Dados do Usuário para Cadastro:', this.user);
      alert('Cadastro realizado com sucesso!');
      

    } else {
      console.log('Formulário inválido. Verifique os campos.');
    }
  }
}