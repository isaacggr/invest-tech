import React from 'react';

interface FormCalculadoraProps {
   valorInicial: number;
   setValorInicial: (valor: number) => void;
   valorMensal: number;
   setValorMensal: (valor: number) => void;
   taxaJuros: number;
   setTaxaJuros: (taxa: number) => void;
   periodo: number;
   setPeriodo: (periodo: number) => void;
}

const FormCalculadora: React.FC<FormCalculadoraProps> = ({
   valorInicial,
   setValorInicial,
   valorMensal,
   setValorMensal,
   taxaJuros,
   setTaxaJuros,
   periodo,
   setPeriodo,
}) => {
   return (
      <div className="input-grid">
         <div className="input-group">
            <label htmlFor="valorInicial">Valor Inicial:</label>
            <div className="input-wrapper">
               <span className="input-prefix">R$</span>
               <input
                  type="number"
                  id="valorInicial"
                  value={valorInicial || ''}
                  onChange={(e) => setValorInicial(Number(e.target.value))}
                  placeholder="Ex: 10000"
                  min="0"
               />
            </div>
         </div>

         <div className="input-group">
            <label htmlFor="valorMensal">Valor mensal:</label>
            <div className="input-wrapper">
               <span className="input-prefix">R$</span>
               <input
                  type="number"
                  id="valorMensal"
                  value={valorMensal || ''}
                  onChange={(e) => setValorMensal(Number(e.target.value))}
                  placeholder="Ex: 500"
                  min="0"
               />
            </div>
         </div>

         <div className="input-group">
            <label htmlFor="taxaJuros">Taxa de Juros:</label>
            <div className="input-wrapper">
               <input
                  type="number"
                  id="taxaJuros"
                  value={taxaJuros || ''}
                  onChange={(e) => setTaxaJuros(Number(e.target.value))}
                  step="0.01"
                  placeholder="Ex: 1.05"
                  min="0"
               />
               <span className="input-suffix">% a.m.</span>
            </div>
         </div>

         <div className="input-group">
            <label htmlFor="periodo">Período em meses:</label>
            <div className="input-wrapper">
               <input
                  type="number"
                  id="periodo"
                  value={periodo || ''}
                  onChange={(e) => setPeriodo(Number(e.target.value))}
                  placeholder="Ex: 120"
                  min="1"
               />
               <span className="input-suffix">meses</span>
            </div>
         </div>
      </div>
   );
};

export default FormCalculadora;
