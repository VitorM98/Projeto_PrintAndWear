import { FabContactComponent } from './../../component/fab-contact/fab-contact.component';
import { Component, signal, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-pedido',
  standalone: true,
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
  
  // SIGNAL PARA QUANTIDADE
  quantidade = signal(1); 
  
  cep = signal('');
  frete = signal(0.00);
  formaPagamento = signal('cartao'); // 'cartao', 'pix', 'boleto'
  
  // Dados da ilustração anexada pelo cliente
  selectedFileName = signal('');
  uploadedIllustrationUrl = signal(''); 

  isModalOpen = signal(false);

  // Array helper para o select de quantidade
  readonly quantidadesDisponiveis = Array.from({ length: 20 }, (_, i) => i + 1);

  // >> NOVO COMPUTED SIGNAL PARA VALIDAR O PEDIDO <<
  isPedidoValido = computed(() => {
    // Verifica seleções de produto (que não devem ser vazias) e quantidade
    const selecoesCompletas = 
      this.modelo() !== '' &&
      this.cor() !== '' &&
      this.tamanho() !== '' &&
      this.quantidade() >= 1; 

    // Verifica se o CEP está preenchido corretamente
    const cepCompleto = this.cep().length === 9;
    
    return selecoesCompletas && cepCompleto;
  });
  // << FIM DO NOVO COMPUTED SIGNAL >>

 //função retorna o nome do arquivo da camisa com base nas seleções do cliente.
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

  calcularFrete() {
    let cepValue = this.cep().replace(/\D/g, ''); 

    if (cepValue.length > 8) {
      cepValue = cepValue.substring(0, 8);
    }

    if (cepValue.length > 5) {
      cepValue = cepValue.replace(/^(\d{5})(\d)/, '$1-$2');
    }


    this.cep.set(cepValue); 

    if (cepValue.length === 9) { 
      this.frete.set(15.00);
    } else {
      this.frete.set(0.00);
    }
  }

  // 8. Cálculo do Total (Computed Signal)
  total = computed(() => {
    // LÓGICA ALTERADA: Multiplica o valor da camisa pela quantidade
    const valorTotalCamisas = this.valorCamisa() * this.quantidade();
    let subtotal = valorTotalCamisas + this.frete();
    
    // Simulação de desconto PIX
    if (this.formaPagamento() === 'pix') {
      subtotal = subtotal * 0.95; // 5% de desconto
    }
    // Arredonda para duas casas decimais
    return parseFloat(subtotal.toFixed(2));
  });

  // 9. Lógica do Botão Finalizar Compra
  finalizarCompra() {
    // Bloqueia a ação se o pedido não for válido
    if (!this.isPedidoValido()) {
        alert("Por favor, preencha todos os campos obrigatórios (seleções de produto e CEP) para finalizar a compra.");
        return; 
    }
    
    console.log('--- FINALIZAR COMPRA ---');
    console.log('Detalhes do Pedido:', {
      modelo: this.modelo(),
      cor: this.cor(),
      tamanho: this.tamanho(),
      quantidade: this.quantidade(), 
      cep: this.cep(),
      pagamento: this.formaPagamento(),
      total: this.total(),
      ilustracao: this.selectedFileName()
    });
    
    alert("Compra realizada! Você pode consultar o status do seu pedido pelo nosso whatsapp informando o seu nome de usuário.");
    
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