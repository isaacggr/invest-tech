import React from 'react';
import { useCalculadora } from './CalculadoraProvider';
import FormCalculadora from './FormCalculadora';
import ResultadoCards from './ResultadoCards';
import GraficoInvestimento from './GraficoInvestimento';
import TabelaDetalhes from './TabelaDetalhes';

const Calculadora: React.FC = () => {
   const {
      valorInicial,
      setValorInicial,
      valorMensal,
      setValorMensal,
      taxaJuros,
      setTaxaJuros,
      periodo,
      setPeriodo,
      dadosMensais,
      totalInvestido,
      totalJuros,
      totalFinal,
   } = useCalculadora();

   // Verifica se o usuário já preencheu os dados necessários
   const dadosPreenchidos =
      valorInicial > 0 || valorMensal > 0 || taxaJuros > 0 || periodo > 0;
   const calculoCompleto =
      dadosMensais.length > 0 &&
      valorInicial > 0 &&
      taxaJuros > 0 &&
      periodo > 0;

   return (
      <div className="calculadora-container">
         <h1>Calculadora de Juros Compostos</h1>

         <div className="card-container">
            <div className="card-principal calculadora-card">
               <h2>Calculadora</h2>
               <FormCalculadora
                  valorInicial={valorInicial}
                  setValorInicial={setValorInicial}
                  valorMensal={valorMensal}
                  setValorMensal={setValorMensal}
                  taxaJuros={taxaJuros}
                  setTaxaJuros={setTaxaJuros}
                  periodo={periodo}
                  setPeriodo={setPeriodo}
               />
            </div>

            <div className="card-principal resultados-card">
               <h2>Resultados</h2>
               {!dadosPreenchidos ? (
                  <div className="mensagem-info">
                     <p>
                        Preencha os dados da calculadora para ver os resultados
                     </p>
                  </div>
               ) : !calculoCompleto ? (
                  <div className="mensagem-info">
                     <p>Preencha todos os campos obrigatórios:</p>
                     <p className="dica">
                        {valorInicial <= 0 && (
                           <span>
                              • Valor inicial
                              <br />
                           </span>
                        )}
                        {taxaJuros <= 0 && (
                           <span>
                              • Taxa de juros
                              <br />
                           </span>
                        )}
                        {periodo <= 0 && (
                           <span>
                              • Período em meses
                              <br />
                           </span>
                        )}
                     </p>
                  </div>
               ) : (
                  <ResultadoCards
                     totalInvestido={totalInvestido}
                     totalJuros={totalJuros}
                     totalFinal={totalFinal}
                  />
               )}
            </div>
         </div>

         {calculoCompleto ? (
            <>
               <div className="card-principal grafico-card">
                  <h2>Evolução do Investimento</h2>
                  <GraficoInvestimento dadosMensais={dadosMensais} />
               </div>

               <div className="card-principal tabela-card">
                  <h2>Detalhes por Mês</h2>
                  <TabelaDetalhes dadosMensais={dadosMensais} />
               </div>
            </>
         ) : (
            <div className="card-principal mensagem-card">
               <div className="mensagem-info">
                  <p>
                     Preencha todos os campos necessários para visualizar o
                     gráfico e a tabela de resultados.
                  </p>
                  <p className="dica">
                     <strong>Dica:</strong> Utilize valores como: Valor inicial:
                     R$ 10.000,00 | Aporte mensal: R$ 500,00 | Taxa: 1,05% a.m.
                     | Período: 120 meses
                  </p>
               </div>
            </div>
         )}
      </div>
   );
};

export default Calculadora;
