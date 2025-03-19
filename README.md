# Invest - Calculadora de Juros Compostos 💵

## 📊 Sobre o Projeto

Invest é uma plataforma web moderna focada em auxiliar investidores a calcular e visualizar o poder dos juros compostos em seus investimentos. Além da calculadora principal, o projeto oferece uma interface intuitiva para acompanhamento de índices da B3, ações brasileiras e criptomoedas em tempo real.

## 🚀 Funcionalidades Principais

### Calculadora de Juros Compostos

-  **Simulação Detalhada**:

   -  Cálculo preciso de juros compostos
   -  Projeção personalizada de rendimentos
   -  Visualização em gráficos interativos
   -  Tabela detalhada mês a mês
   -  Análise de diferentes cenários de investimento

-  **Campos de Entrada**:
   -  Valor inicial do investimento
   -  Aportes mensais
   -  Taxa de juros
   -  Período do investimento
   -  Opções de rentabilidade

### Acompanhamento de Mercado

-  **Índices B3**: Monitoramento dos principais índices

   -  Ibovespa (IBOV)
   -  Índice Brasil 100 (IBXX)
   -  Small Cap (SMLL)
   -  MidLarge Cap (MLCX)
   -  Índice de Dividendos (IDIV)
   -  Índice de Fundos Imobiliários (IFIX)
   -  Índice de Governança Corporativa (IGCT)
   -  Índice de Sustentabilidade (ISEE)

-  **Ações Brasileiras**: Cotações das principais ações

   -  Petrobras (PETR4)
   -  Vale (VALE3)
   -  Itaú (ITUB4)
   -  Bradesco (BBDC4)
   -  Ambev (ABEV3)
   -  B3 (B3SA3)
   -  Magazine Luiza (MGLU3)
   -  WEG (WEGE3)

-  **Criptomoedas**: Valores atualizados
   -  Bitcoin (BTC)
   -  Ethereum (ETH)
   -  Binance Coin (BNB)
   -  Solana (SOL)
   -  Cardano (ADA)
   -  XRP
   -  Dogecoin (DOGE)
   -  Polkadot (DOT)

## 🛠️ Tecnologias Utilizadas

-  React.js
-  TypeScript
-  Node.js
-  API Partnr para dados em tempo real
-  Chart.js para visualização de gráficos

## ⚙️ Instalação e Uso

1. Clone o repositório:

```bash
git clone https://github.com/isaacggr/invest-tech.git
```

2. Instale as dependências:

```bash
cd invest
npm install
```

3. Configure as variáveis de ambiente:

-  Crie um arquivo `.env` na raiz do projeto
-  Adicione sua chave da API Partnr:

```
REACT_APP_PARTNR_API_KEY=sua_chave_aqui
```

4. Inicie o projeto:

```bash
npm run dev
```

## 🔄 Atualizações de Dados

-  Índices B3: Atualização a cada 30 segundos
-  Ações Brasileiras: Atualização a cada 30 segundos
-  Criptomoedas: Atualização a cada 60 segundos

## 📱 Responsividade

O projeto é totalmente responsivo e adaptável a diferentes tamanhos de tela:

-  Desktop
-  Tablet
-  Dispositivos móveis

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por [Isaac Gregorio](https://github.com/isaacggr)
