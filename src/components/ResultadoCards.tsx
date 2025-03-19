import React from 'react';

interface ResultadoCardsProps {
   totalInvestido: number;
   totalJuros: number;
   totalFinal: number;
}

const ResultadoCards: React.FC<ResultadoCardsProps> = ({
   totalInvestido,
   totalJuros,
   totalFinal,
}) => {
   return (
      <div className="resultado-cards">
         <div className="card investido">
            <h3>Total investido:</h3>
            <p>
               R${' '}
               {totalInvestido.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
               })}
            </p>
         </div>

         <div className="card juros">
            <h3>Total em juros:</h3>
            <p>
               R${' '}
               {totalJuros.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
               })}
            </p>
         </div>

         <div className="card total">
            <h3>TOTAL FINAL:</h3>
            <p>
               R${' '}
               {totalFinal.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
               })}
            </p>
         </div>
      </div>
   );
};

export default ResultadoCards;
