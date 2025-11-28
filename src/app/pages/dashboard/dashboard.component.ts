import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CamisasService } from '../../services/camisa.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  toggleMenu(): void {
    const menu = document.getElementById('menuModal');
    const btn = document.getElementById('btn-menu');
    const overlay = document.getElementById('overlay');

    menu?.classList.toggle('ativo');
    btn?.classList.toggle('ativo');
    overlay?.classList.toggle('ativo');
  }

  constructor(private authService: AuthService, private http: HttpClient, private camisasService: CamisasService) { }
  logout(): void {
    this.authService.logout();
  }

  // dashboard

  tipos = [
    { label: 'Camisa Masculina', value: 'masculino' },
    { label: 'Camisa Feminina', value: 'feminino' }
  ];

  tipoSelecionado = '';
  tabelaDados: any[] = [];
  dadosApi: any = {};
  carregando = true;

  // PROPRIEDADES DE RESUMO
  totalEstoque: number = 0;
  totalVendidos: number = 0;
  precoFixo: number = 50.00;
  valorTotalVendidos: number = 0; // Corrigido para plural
  // FIM PROPRIEDADES DE RESUMO


  ngOnInit(): void {
    console.log("Dashboard carregou! (ngOnInit)");

    this.camisasService.getAll().subscribe({
      next: (res: any) => {
        console.log("API respondeu:", res);
        this.dadosApi = res;
        this.carregando = false;
      },
      error: (err: any) => {
        console.error("Erro na API:", err);
      }
    });
  }

  onSelectTipo(): void {
    if (!this.tipoSelecionado) {
      this.tabelaDados = [];
      this.calcularTotais(); // Reseta os totais quando a seleção é limpa
      return;
    }

    const dadosTipo = this.dadosApi[this.tipoSelecionado];
    const temp: any[] = [];

    // Popula a tabelaDados
    for (let tamanho in dadosTipo) {
      for (let cor in dadosTipo[tamanho]) {
        const item = dadosTipo[tamanho][cor];
        temp.push({
          tamanho,
          cor,
          vendidos: item.vendidos,
          estoque: item.estoque
        });
      }
    }

    this.tabelaDados = temp;
    this.calcularTotais(); // Calcula os totais após a atualização da tabela
  }

  // MÉTODO PARA CALCULAR TOTAIS
  calcularTotais(): void {
    this.totalEstoque = 0;
    this.totalVendidos = 0;

    // Soma os valores de vendidos e estoque da tabelaDados
    for (const item of this.tabelaDados) {
      this.totalEstoque += item.estoque;
      this.totalVendidos += item.vendidos;
    }

    // Calcula o valor total vendido (Quantidade * Preço Fixo)
    this.valorTotalVendidos = this.totalVendidos * this.precoFixo;
  }
  
  /**
   * Formata o valor numérico como Real Brasileiro (R$).
   * Usa Intl.NumberFormat para garantir a formatação correta sem depender da
   * configuração global do LOCALE_ID do Angular.
   */
  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  }
}