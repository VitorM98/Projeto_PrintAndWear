import { FabContactComponent } from './../../component/fab-contact/fab-contact.component';
import { Component, signal, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-pedido',
  // O FormsModule e o FabContactComponent precisam estar aqui.
  standalone: true, // Adicionado (se não estava, deve estar para projetos Standalone)
  imports: [FormsModule, FabContactComponent], 
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent {

  // 1. Configuração e Preços
  readonly valorCamisa = signal(50.00);

  // 2. Estado do Produto e Frete (Signals)
  modelo = signal('masculino');
  cor = signal('preta');
  tamanho = signal('M');
  cep = signal('');
  frete = signal(0.00);
  formaPagamento = signal('cartao'); // 'cartao', 'pix', 'boleto'
  
  // Dados da ilustração anexada pelo cliente
  selectedFileName = signal('');
  uploadedIllustrationUrl = signal(''); // URL para a imagem anexada

  // 3. Estado da UI
  isModalOpen = signal(false);

  // 4. Lógica para determinar a imagem da camisa base (computed)
  // Esta função retorna o nome do arquivo da camisa com base nas seleções do cliente.
  caminhoImagemCamisa = computed(() => {
    const m = this.modelo();
    const c = this.cor();

    if (m === 'masculino' && c === 'preta') {
      return 'camisacrua4.png';
    } else if (m === 'feminino' && c === 'preta') {
      return 'camisacrua3.png';
    } else if (m === 'masculino' && c === 'branca') {
      return 'camisacrua2.png';
    } else if (m === 'feminino' && c === 'branca') {
      return 'camisacrua1.png';
    }
    // Fallback padrão se não houver seleção
    return '';
  });

  // 5. Lógica de Abertura/Fechamento do Modal
  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  // 6. Lógica de Upload de Arquivo
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName.set(file.name);
      
      // Cria uma URL temporária para pré-visualizar a ilustração
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedIllustrationUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      console.log('Arquivo selecionado:', file.name);
    } else {
      this.selectedFileName.set('');
      this.uploadedIllustrationUrl.set('');
    }
  }

  // 7. Lógica de Cálculo de Frete (Com Máscara de CEP)
  calcularFrete() {
    // 1. Remove qualquer caractere que não seja dígito.
    let cepValue = this.cep().replace(/\D/g, ''); 

    // 2. Limita o valor a um máximo de 8 dígitos.
    if (cepValue.length > 8) {
      cepValue = cepValue.substring(0, 8);
    }

    // 3. Aplica a máscara de formatação (5 dígitos + hífen + 3 dígitos)
    if (cepValue.length > 5) {
      cepValue = cepValue.replace(/^(\d{5})(\d)/, '$1-$2');
    }

    // 4. Atualiza o signal 'cep' com o valor formatado/limitado.
    this.cep.set(cepValue); 

    // 5. Verifica o tamanho final (9 caracteres no formato "00000-000") para o cálculo do frete
    if (cepValue.length === 9) { 
      // Simulação: Frete de R$15.00 para CEPs válidos
      this.frete.set(15.00);
    } else {
      // Frete 0 ou a calcular
      this.frete.set(0.00);
    }
  }

  // 8. Cálculo do Total (Computed Signal)
  total = computed(() => {
    let subtotal = this.valorCamisa() + this.frete();
    // Simulação de desconto PIX
    if (this.formaPagamento() === 'pix') {
      subtotal = subtotal * 0.95; // 5% de desconto
    }
    // Arredonda para duas casas decimais
    return parseFloat(subtotal.toFixed(2));
  });

  // 9. Lógica do Botão Finalizar Compra
  finalizarCompra() {
    console.log('--- FINALIZAR COMPRA ---');
    console.log('Detalhes do Pedido:', {
      modelo: this.modelo(),
      cor: this.cor(),
      tamanho: this.tamanho(),
      cep: this.cep(),
      pagamento: this.formaPagamento(),
      total: this.total(),
      ilustracao: this.selectedFileName()
    });
    
    // Ação solicitada: dar um refresh na página
    window.location.reload();
  }

  // Métodos originais do componente (mantidos)
  toggleMenu(): void {
    const menu = document.getElementById('menuModal');
    const btn = document.getElementById('btn-menu');
    const overlay = document.getElementById('overlay');

    menu?.classList.toggle('ativo');
    btn?.classList.toggle('ativo');
    overlay?.classList.toggle('ativo');
  }

  constructor(private authService: AuthService, private http: HttpClient) { }
  
  logout(): void {
    this.authService.logout();
  }
}