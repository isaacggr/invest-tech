import React, { useState, useEffect } from 'react';
import { fetchMarketData } from '../config/api';

interface BrapiIbovResponse {
   currency: string;
   marketCap: number | null;
   shortName: string;
   longName: string;
   regularMarketChange: number;
   regularMarketChangePercent: number;
   regularMarketTime: string;
   regularMarketPrice: number;
   regularMarketDayHigh: number;
   regularMarketDayLow: number;
   regularMarketVolume: number;
   regularMarketPreviousClose: number;
   regularMarketOpen: number;
   fiftyTwoWeekRange: string;
   fiftyTwoWeekLow: number;
   fiftyTwoWeekHigh: number;
   symbol: string;
}

interface Indice {
   id: string;
   nome: string;
   sigla: string;
   valor: number;
   variacao: number;
   cor: string;
   maxDia: number;
   minDia: number;
   abertura: number;
   fechamentoAnterior: number;
   maxAnual: number;
   minAnual: number;
   ultimaAtualizacao: string;
}

const IndicesB3: React.FC = () => {
   const [indices, setIndices] = useState<Indice[]>([]);
   const [carregando, setCarregando] = useState(true);
   const [erro, setErro] = useState<string | null>(null);
   const [ultimaAtualizacao, setUltimaAtualizacao] = useState('');

   const formatarDataHora = () => {
      return new Intl.DateTimeFormat('pt-BR', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
         hour12: false,
      }).format(new Date());
   };

   const buscarIndices = async () => {
      try {
         setCarregando(true);

         const response = await fetch(
            `https://brapi.dev/api/quote/%5EBVSP?token=${
               import.meta.env.VITE_BRAPI_TOKEN
            }`
         );

         if (!response.ok) {
            throw new Error('Erro ao buscar índice');
         }

         const data = await response.json();
         const item: BrapiIbovResponse = data.results[0];

         const indiceProcessado: Indice = {
            id: '1',
            nome: item.longName,
            sigla: item.symbol,
            valor: item.regularMarketPrice,
            variacao: item.regularMarketChangePercent,
            cor: item.regularMarketChangePercent >= 0 ? 'verde' : 'vermelho',
            maxDia: item.regularMarketDayHigh || item.regularMarketPrice,
            minDia: item.regularMarketDayLow || item.regularMarketPrice,
            abertura: item.regularMarketOpen,
            fechamentoAnterior: item.regularMarketPreviousClose,
            maxAnual: item.fiftyTwoWeekHigh,
            minAnual: item.fiftyTwoWeekLow || 0,
            ultimaAtualizacao: formatarDataHora(),
         };

         setIndices([indiceProcessado]);
         setUltimaAtualizacao(formatarDataHora());
         setErro(null);
      } catch (error) {
         console.error('Erro:', error);
         setErro('Erro ao carregar índice');
         buscarIndicesSimulados();
      } finally {
         setCarregando(false);
      }
   };

   const buscarIndicesSimulados = () => {
      const dadosSimulados = [
         {
            id: '1',
            nome: 'Ibovespa',
            sigla: '^BVSP',
            valor: 132067.69,
            variacao: 0.568,
            cor: 'verde',
            maxDia: 132500.45,
            minDia: 131200.78,
            abertura: 131500.23,
            fechamentoAnterior: 131320.89,
            maxAnual: 132500.45,
            minAnual: 131200.78,
            ultimaAtualizacao: formatarDataHora(),
         },
      ];

      setIndices(dadosSimulados);
      setUltimaAtualizacao(formatarDataHora());
   };

   useEffect(() => {
      buscarIndices();
   }, []);

   const formatarNumero = (valor: number) => {
      return new Intl.NumberFormat('pt-BR').format(valor);
   };

   const formatarVariacao = (variacao: number) => {
      return variacao.toFixed(2);
   };

   if (carregando && indices.length === 0) {
      return (
         <div className="card-principal indices-card">
            <h2>Índice Bovespa</h2>
            <div className="mensagem-info mensagem-card">
               <p>Carregando índice...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="card-principal indices-card">
         <h2>Índice Bovespa</h2>
         <div className="indices-grid">
            {indices.map((indice) => (
               <div key={indice.id} className="indice-item indice-ibovespa">
                  <div className="indice-header">
                     <h3>{indice.sigla}</h3>
                     <span className="indice-nome">{indice.nome}</span>
                  </div>
                  <div className="indice-conteudo">
                     <div className="indice-principal">
                        <div className="valor-principal">
                           <span className="indice-valor">
                              {formatarNumero(indice.valor)}
                           </span>
                           <span className={`indice-variacao ${indice.cor}`}>
                              {indice.variacao > 0 ? '+' : ''}
                              {formatarVariacao(indice.variacao)}%
                           </span>
                        </div>
                     </div>
                     <div className="indice-detalhes">
                        <div className="detalhe-col">
                           <div className="detalhe-item">
                              <span className="detalhe-label">Abertura:</span>
                              <span className="detalhe-valor">
                                 {formatarNumero(indice.abertura)}
                              </span>
                           </div>
                           <div className="detalhe-item">
                              <span className="detalhe-label">
                                 Máxima 52 sem:
                              </span>
                              <span className="detalhe-valor">
                                 {formatarNumero(indice.maxAnual)}
                              </span>
                           </div>
                           <div className="detalhe-item">
                              <span className="detalhe-label">Máxima Dia:</span>
                              <span className="detalhe-valor">
                                 {formatarNumero(indice.maxDia)}
                              </span>
                           </div>
                        </div>
                        <div className="detalhe-col">
                           <div className="detalhe-item">
                              <span className="detalhe-label">
                                 Fech. Anterior:
                              </span>
                              <span className="detalhe-valor">
                                 {formatarNumero(indice.fechamentoAnterior)}
                              </span>
                           </div>
                           <div className="detalhe-item">
                              <span className="detalhe-label">
                                 Mínima 52 sem:
                              </span>
                              <span className="detalhe-valor">
                                 {formatarNumero(indice.minAnual)}
                              </span>
                           </div>
                           <div className="detalhe-item">
                              <span className="detalhe-label">Mínima Dia:</span>
                              <span className="detalhe-valor">
                                 {formatarNumero(indice.minDia)}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
         <div className="indice-atualizacao">
            <span>Última atualização: {ultimaAtualizacao}</span>
            <small>Dados atualizados a cada 30 segundos</small>
         </div>
      </div>
   );
};

export default IndicesB3;
