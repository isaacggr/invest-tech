import React, { createContext, useState, useEffect, useContext } from 'react';
import { DadosMensais } from '../types';

interface CalculadoraContextType {
   valorInicial: number;
   setValorInicial: (valor: number) => void;
   valorMensal: number;
   setValorMensal: (valor: number) => void;
   taxaJuros: number;
   setTaxaJuros: (taxa: number) => void;
   periodo: number;
   setPeriodo: (periodo: number) => void;
   dadosMensais: DadosMensais[];
   totalInvestido: number;
   totalJuros: number;
   totalFinal: number;
}

const CalculadoraContext = createContext<CalculadoraContextType | undefined>(
   undefined
);

export const useCalculadora = (): CalculadoraContextType => {
   const context = useContext(CalculadoraContext);
   if (!context) {
      throw new Error(
         'useCalculadora deve ser usado dentro de um CalculadoraProvider'
      );
   }
   return context;
};

interface CalculadoraProviderProps {
   children: React.ReactNode;
}

export const CalculadoraProvider: React.FC<CalculadoraProviderProps> = ({
   children,
}) => {
   const [valorInicial, setValorInicial] = useState(0);
   const [valorMensal, setValorMensal] = useState(0);
   const [taxaJuros, setTaxaJuros] = useState(0);
   const [periodo, setPeriodo] = useState(0);
   const [dadosMensais, setDadosMensais] = useState<DadosMensais[]>([]);
   const [totalInvestido, setTotalInvestido] = useState(0);
   const [totalJuros, setTotalJuros] = useState(0);
   const [totalFinal, setTotalFinal] = useState(0);

   useEffect(() => {
      calcularJurosCompostos();
   }, [valorInicial, valorMensal, taxaJuros, periodo]);

   const calcularJurosCompostos = () => {
      // Validar os valores de entrada para evitar cálculos com valores inválidos
      if (
         valorInicial < 0 ||
         valorMensal < 0 ||
         taxaJuros <= 0 ||
         periodo <= 0
      ) {
         setDadosMensais([]);
         setTotalInvestido(0);
         setTotalJuros(0);
         setTotalFinal(0);
         return;
      }

      let saldoAtual = valorInicial;
      let totalAportado = valorInicial;
      let totalJurosGerados = 0;
      const dadosMensaisCalculados: DadosMensais[] = [];

      // Adiciona o mês 0 (inicial)
      dadosMensaisCalculados.push({
         mes: 0,
         valorInvestido: valorInicial,
         rendimento: 0,
         valorAcumulado: valorInicial,
         aporteMensal: valorMensal,
         totalInvestido: valorInicial,
         jurosAcumulado: 0,
         totalAcumulado: valorInicial,
      });

      // Calcula os juros compostos para cada mês
      for (let i = 1; i <= periodo; i++) {
         // Adiciona o aporte mensal
         saldoAtual += valorMensal;
         totalAportado += valorMensal;

         // Calcula os juros do mês (taxa em percentual, por isso divide por 100)
         const jurosDoMes = saldoAtual * (taxaJuros / 100);
         totalJurosGerados += jurosDoMes;

         // Atualiza o saldo com os juros
         saldoAtual += jurosDoMes;

         // Arredonda para duas casas decimais
         const jurosArredondado = parseFloat(jurosDoMes.toFixed(2));
         const saldoArredondado = parseFloat(saldoAtual.toFixed(2));

         // Adiciona os dados deste mês ao array
         dadosMensaisCalculados.push({
            mes: i,
            valorInvestido: totalAportado,
            rendimento: jurosArredondado,
            valorAcumulado: saldoArredondado,
            aporteMensal: valorMensal,
            totalInvestido: totalAportado,
            jurosAcumulado: totalJurosGerados,
            totalAcumulado: saldoArredondado,
         });
      }

      setDadosMensais(dadosMensaisCalculados);
      setTotalInvestido(parseFloat(totalAportado.toFixed(2)));
      setTotalJuros(parseFloat(totalJurosGerados.toFixed(2)));
      setTotalFinal(parseFloat(saldoAtual.toFixed(2)));
   };

   const value = {
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
   };

   return (
      <CalculadoraContext.Provider value={value}>
         {children}
      </CalculadoraContext.Provider>
   );
};

export default CalculadoraProvider;
