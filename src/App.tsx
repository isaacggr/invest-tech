import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import GraficoInvestimento from './components/GraficoInvestimento';
import TabelaDetalhes from './components/TabelaDetalhes';
import IndicesB3 from './components/IndicesB3';
import AcoesBrasil from './components/AcoesBrasil';
import Criptomoedas from './components/Criptomoedas';
import Footer from './components/Footer';

interface Detalhe {
   mes: number;
   rendimento: number;
   valorInvestido: number;
   valorAcumulado: number;
   aporteMensal: number;
}

const App: React.FC = () => {
   const [valorInicial, setValorInicial] = useState<number>(0);
   const [aporteMensal, setAporteMensal] = useState<number>(0);
   const [taxaJuros, setTaxaJuros] = useState<number>(0);
   const [periodo, setPeriodo] = useState<number>(0);
   const [detalhes, setDetalhes] = useState<Detalhe[]>([]);
   const [mostrarResultados, setMostrarResultados] = useState<boolean>(false);
   const [totalInvestido, setTotalInvestido] = useState<number>(0);
   const [totalRendimentos, setTotalRendimentos] = useState<number>(0);
   const [totalFinal, setTotalFinal] = useState<number>(0);
   const [inputsValidos, setInputsValidos] = useState<boolean>(false);

   // Validação de inputs
   useEffect(() => {
      const valoresValidos =
         valorInicial >= 0 &&
         aporteMensal >= 0 &&
         taxaJuros >= 0 &&
         periodo > 0;

      setInputsValidos(valoresValidos);

      if (!valoresValidos) {
         setMostrarResultados(false);
      }
   }, [valorInicial, aporteMensal, taxaJuros, periodo]);

   // Calculadora de juros compostos
   const calcularInvestimento = useCallback(() => {
      if (!inputsValidos) return;

      // Converter taxa anual para mensal
      const taxaMensal = (Math.pow(1 + taxaJuros / 100, 1 / 12) - 1) * 100;

      let detalhesCalculados: Detalhe[] = [];
      let saldoAtual = valorInicial;
      let totalAportes = valorInicial;

      // Calcular detalhes mês a mês
      for (let i = 1; i <= periodo; i++) {
         // Calcular rendimento do mês atual usando taxa mensal
         const rendimentoMensal = saldoAtual * (taxaMensal / 100);

         // Adicionar aporte mensal (após o rendimento)
         saldoAtual += rendimentoMensal + aporteMensal;

         // Atualizar total investido
         totalAportes += aporteMensal;

         // Adicionar dados aos detalhes
         detalhesCalculados.push({
            mes: i,
            rendimento: rendimentoMensal,
            valorInvestido: totalAportes,
            valorAcumulado: saldoAtual,
            aporteMensal: aporteMensal,
         });
      }

      // Atualizar estados com os resultados finais
      if (detalhesCalculados.length > 0) {
         const ultimo = detalhesCalculados[detalhesCalculados.length - 1];
         setTotalInvestido(ultimo.valorInvestido);
         setTotalRendimentos(ultimo.valorAcumulado - ultimo.valorInvestido);
         setTotalFinal(ultimo.valorAcumulado);
         setDetalhes(detalhesCalculados);
         setMostrarResultados(true);
      }
   }, [valorInicial, aporteMensal, taxaJuros, periodo, inputsValidos]);

   // Ao pressionar Enter no campo período, calcular resultados
   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputsValidos) {
         calcularInvestimento();
      }
   };

   // Formatação de números
   const formatarMoeda = (valor: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL',
      }).format(valor);
   };

   // Função para voltar ao topo
   const voltarAoTopo = () => {
      window.scrollTo({
         top: 0,
         behavior: 'smooth',
      });
   };

   // Função para reiniciar a calculadora
   const reiniciarCalculadora = () => {
      setValorInicial(0);
      setAporteMensal(0);
      setTaxaJuros(0);
      setPeriodo(0);
      setDetalhes([]);
      setMostrarResultados(false);
      setTotalInvestido(0);
      setTotalRendimentos(0);
      setTotalFinal(0);

      // Voltar ao topo após reiniciar
      setTimeout(() => {
         voltarAoTopo();
      }, 100);
   };

   return (
      <div className="calculadora-container">
         <h1>Calculadora de Investimentos</h1>

         <div className="card-container">
            {/* Card da Calculadora */}
            <div
               className="card-principal calculadora-card"
               id="calculadora-inputs"
            >
               <h2>Simulação</h2>
               <div className="input-grid">
                  <div className="input-group">
                     <label htmlFor="valorInicial">Valor Inicial</label>
                     <div className="input-wrapper">
                        <span className="input-prefix">R$</span>
                        <input
                           type="number"
                           id="valorInicial"
                           value={valorInicial === 0 ? '' : valorInicial}
                           onChange={(e) =>
                              setValorInicial(Number(e.target.value))
                           }
                           placeholder="0,00"
                        />
                     </div>
                  </div>

                  <div className="input-group">
                     <label htmlFor="aporteMensal">Aporte Mensal</label>
                     <div className="input-wrapper">
                        <span className="input-prefix">R$</span>
                        <input
                           type="number"
                           id="aporteMensal"
                           value={aporteMensal === 0 ? '' : aporteMensal}
                           onChange={(e) =>
                              setAporteMensal(Number(e.target.value))
                           }
                           placeholder="0,00"
                        />
                     </div>
                  </div>

                  <div className="input-group">
                     <label htmlFor="taxaJuros">Taxa de Juros (% a.a.)</label>
                     <div className="input-wrapper">
                        <input
                           type="number"
                           id="taxaJuros"
                           value={taxaJuros === 0 ? '' : taxaJuros}
                           onChange={(e) =>
                              setTaxaJuros(Number(e.target.value))
                           }
                           placeholder="0,00"
                        />
                        <span className="input-suffix">%</span>
                     </div>
                  </div>

                  <div className="input-group">
                     <label htmlFor="periodo">Período (meses)</label>
                     <div className="input-wrapper">
                        <input
                           type="number"
                           id="periodo"
                           value={periodo === 0 ? '' : periodo}
                           onChange={(e) => setPeriodo(Number(e.target.value))}
                           onKeyPress={handleKeyPress}
                           placeholder="0"
                        />
                        <span className="input-suffix">meses</span>
                     </div>
                  </div>

                  <div className="input-group">
                     <button
                        onClick={calcularInvestimento}
                        disabled={!inputsValidos}
                        className="calcular-btn"
                     >
                        Calcular
                     </button>
                  </div>
               </div>
            </div>

            {/* Card de Resultados */}
            <div className="card-principal resultados-card">
               <h2>Resultados</h2>
               {!mostrarResultados ? (
                  <div className="mensagem-info mensagem-card">
                     <p>Complete a simulação para ver os resultados.</p>
                     <p className="dica">
                        Preencha todos os campos e clique em "Calcular".
                     </p>
                  </div>
               ) : (
                  <div className="resultado-cards">
                     <div className="card investido">
                        <h3>Total Investido</h3>
                        <p>{formatarMoeda(totalInvestido)}</p>
                     </div>

                     <div className="card juros">
                        <h3>Total em Rendimentos</h3>
                        <p>{formatarMoeda(totalRendimentos)}</p>
                     </div>

                     <div className="card total">
                        <h3>Valor Final</h3>
                        <p>{formatarMoeda(totalFinal)}</p>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* Gráfico */}
         <div className="card-principal grafico-card">
            <h2>Evolução do Patrimônio</h2>
            <GraficoInvestimento dados={detalhes} />
         </div>

         {/* Tabela de Detalhes */}
         <div className="card-principal tabela-card">
            <h2>Detalhamento Mês a Mês</h2>
            <TabelaDetalhes detalhes={detalhes} />
         </div>

         {/* Índices B3 */}
         <IndicesB3 />

         {/* Principais Ações Brasileiras */}
         <AcoesBrasil />

         {/* Principais Criptomoedas */}
         <Criptomoedas />

         {/* Footer */}
         <Footer />

         {/* Botões de navegação */}
         {mostrarResultados && (
            <div className="acoes-botoes">
               <button
                  className="voltar-topo-btn"
                  onClick={voltarAoTopo}
                  aria-label="Voltar ao topo"
               >
                  ↑ Alterar valores
               </button>

               <button
                  className="reiniciar-btn"
                  onClick={reiniciarCalculadora}
                  aria-label="Reiniciar calculadora"
               >
                  ↻ Nova simulação
               </button>
            </div>
         )}
      </div>
   );
};

export default App;
