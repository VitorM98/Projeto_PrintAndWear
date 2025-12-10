const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path"); 

const app = express();
app.use(cors());
app.use(express.json());

const caminhoJson = path.join(__dirname, "data", "camisas.json"); 

const camisas = JSON.parse(fs.readFileSync(caminhoJson, "utf8"));

// ➤ Cálculo do valor total vendido (sem quebrar caso "feminino" não exista)
function calcularTotalVendido() {
  let totalVendidos = 0;

  ["masculino", "feminino"].forEach((tipo) => {
    if (!camisas[tipo]) return;

    Object.values(camisas[tipo]).forEach((tamanhos) => {
      Object.values(tamanhos).forEach((cores) => {
        totalVendidos += cores.vendidos;
      });
    });
  });

  return totalVendidos * 50; // preço unitário
}

// Atualiza o campo no objeto carregado
camisas.valor_total_vendido = calcularTotalVendido();

// Listar tudo
app.get("/api/camisas", (req, res) => {
  res.json(camisas);
});

// Filtrar por tipo/tamanho/cor
app.get("/api/camisas/:tipo/:tamanho/:cor", (req, res) => {
  const { tipo, tamanho, cor } = req.params;

  if (
    !camisas[tipo] ||
    !camisas[tipo][tamanho] ||
    !camisas[tipo][tamanho][cor]
  ) {
    return res.status(404).json({ erro: "Item não encontrado" });
  }

  res.json({
    tipo,
    tamanho,
    cor,
    ...camisas[tipo][tamanho][cor]
  });
});

// Rota específica para total vendido
app.get("/api/total-vendido", (req, res) => {
  res.json({
    valor_total_vendido: camisas.valor_total_vendido
  });
});

module.exports = app;