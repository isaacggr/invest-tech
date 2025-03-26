import React, { useState, useEffect } from 'react';
import { isMarketOpen, getNextUpdate } from '../utils/marketTime';
import { buildUrl, BrapiQuoteItem, fetchMarketData } from '../config/api';

interface Acao {
   id: string;
   nome: string;
   codigo: string;
   valor: number;
   variacao: number;
   cor: string;
   ultimaAtualizacao: string;
}

// Adicionar interface para o item da API

const AcoesBrasil: React.FC = () => {
   const [acoes, setAcoes] = useState<Acao[]>([]);
   const [carregando, setCarregando] = useState<boolean>(true);
   const [erro, setErro] = useState<string | null>(null);
   const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>('');

   // Função para formatar a data e hora
   const formatarDataHora = () => {
      const agora = new Date();
      return new Intl.DateTimeFormat('pt-BR', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
         hour12: false,
      }).format(agora);
   };

   // Função para formatar a data da API
   const formatarDataAPI = (dataString: string) => {
      const data = new Date(dataString);
      return new Intl.DateTimeFormat('pt-BR', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
         hour12: false,
      }).format(data);
   };

   // Função para buscar dados simulados das ações
   const buscarAcoesSimuladas = () => {
      try {
         setCarregando(true);

         // Dados estáticos para simulação
         const dadosSimulados = [
            {
               id: '1',
               nome: 'Petrobras',
               codigo: 'PETR4',
               valor: 37.92,
               variacao: 0.85,
            },
            {
               id: '2',
               nome: 'Vale',
               codigo: 'VALE3',
               valor: 66.85,
               variacao: -0.48,
            },
            {
               id: '3',
               nome: 'Itaú Unibanco',
               codigo: 'ITUB4',
               valor: 34.92,
               variacao: 0.56,
            },
            {
               id: '4',
               nome: 'Klabin',
               codigo: 'KLBN4',
               valor: 24.32,
               variacao: 0.65,
            },
            {
               id: '5',
               nome: 'Taesa',
               codigo: 'TAEE3',
               valor: 38.75,
               variacao: -0.18,
            },
            {
               id: '6',
               nome: 'Banco do Brasil',
               codigo: 'BBAS3',
               valor: 54.92,
               variacao: 0.82,
            },
            {
               id: '7',
               nome: 'BB Seguridade',
               codigo: 'BBSE3',
               valor: 33.45,
               variacao: 0.25,
            },
            {
               id: '8',
               nome: 'Auren Energia',
               codigo: 'AURE3',
               valor: 12.82,
               variacao: -0.34,
            },
         ].map((item) => ({
            ...item,
            cor: item.variacao >= 0 ? 'verde' : 'vermelho',
            ultimaAtualizacao: formatarDataHora(),
         }));

         setAcoes(dadosSimulados);
         setUltimaAtualizacao(formatarDataHora());
         setErro(null);
      } catch (error) {
         console.error('Erro ao carregar dados simulados:', error);
         setErro(
            'Erro ao carregar ações. Tentando novamente no próximo horário de mercado.'
         );
      } finally {
         setCarregando(false);
      }
   };

   // Função para buscar dados das ações
   const buscarAcoes = async () => {
      try {
         setCarregando(true);

         const acoesDesejadas = [
            { symbol: 'PETR4', nome: 'Petrobras' },
            { symbol: 'VALE3', nome: 'Vale' },
            { symbol: 'ITUB4', nome: 'Itaú Unibanco' },
            { symbol: 'KLBN4', nome: 'Klabin' },
            { symbol: 'TAEE3', nome: 'Taesa' },
            { symbol: 'BBAS3', nome: 'Banco do Brasil' },
            { symbol: 'BBSE3', nome: 'BB Seguridade' },
            { symbol: 'AURE3', nome: 'Auren Energia' },
         ];

         const acoesProcessadas = await Promise.all(
            acoesDesejadas.map(async (acao, index) => {
               try {
                  // Chamada direta à API sem proxy
                  const response = await fetch(
                     `https://brapi.dev/api/quote/${encodeURIComponent(
                        acao.symbol
                     )}?token=${import.meta.env.VITE_BRAPI_TOKEN}`
                  );

                  if (!response.ok) {
                     throw new Error(`Erro ao buscar ${acao.nome}`);
                  }

                  const data = await response.json();
                  const item = data.results[0];

                  return {
                     id: String(index + 1),
                     nome: acao.nome,
                     codigo: acao.symbol,
                     valor: item.regularMarketPrice,
                     variacao: item.regularMarketChangePercent,
                     cor:
                        item.regularMarketChangePercent >= 0
                           ? 'verde'
                           : 'vermelho',
                     ultimaAtualizacao: formatarDataHora(),
                  };
               } catch (error) {
                  console.error(`Erro ao buscar ${acao.nome}:`, error);
                  return null;
               }
            })
         );

         const acoesValidas = acoesProcessadas.filter((acao) => acao !== null);

         if (acoesValidas.length > 0) {
            setAcoes(acoesValidas);
            setUltimaAtualizacao(formatarDataHora());
            setErro(null);
         } else {
            throw new Error('Nenhuma ação pôde ser carregada');
         }
      } catch (error) {
         console.error('Erro:', error);
         setErro('Erro ao carregar ações');
         buscarAcoesSimuladas();
      } finally {
         setCarregando(false);
      }
   };

   useEffect(() => {
      const fetchData = async () => {
         await buscarAcoes();
      };

      // Limitar chamadas para 2 vezes ao dia: uma às 10:00 e outra às 17:00
      const now = new Date();
      const nextUpdate =
         now.getHours() < 10
            ? new Date(now.setHours(10, 0, 0, 0))
            : new Date(now.setHours(17, 0, 0, 0));
      const delay = nextUpdate.getTime() - Date.now();

      fetchData();
      const intervalId = setInterval(fetchData, 12 * 60 * 60 * 1000); // 12 horas

      return () => clearInterval(intervalId);
   }, []);

   // Formatar o valor numérico para moeda
   const formatarMoeda = (valor: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL',
      }).format(valor);
   };

   // Formatar a variação para exibição
   const formatarVariacao = (variacao: number) => {
      return variacao.toFixed(2);
   };

   // Mostrar mensagem de carregamento
   if (carregando && acoes.length === 0) {
      return (
         <div className="card-principal indices-card">
            <h2>Principais Ações</h2>
            <div className="mensagem-info mensagem-card">
               <p>Carregando dados das ações...</p>
            </div>
         </div>
      );
   }

   // Mostrar mensagem de erro se não conseguir carregar os dados
   if (erro) {
      return (
         <div className="card-principal indices-card">
            <h2>Principais Ações</h2>
            <div className="mensagem-info mensagem-card erro">
               <p>{erro}</p>
               <button onClick={buscarAcoes} className="atualizar-btn">
                  Tentar novamente
               </button>
            </div>
         </div>
      );
   }

   // Dividir as ações em duas linhas (4 em cada)
   const primeiraLinha = acoes.slice(0, 4);
   const segundaLinha = acoes.slice(4, 8);

   return (
      <div className="card-principal indices-card">
         <h2>Principais Ações Brasileiras</h2>
         <div className="indices-grid">
            <div className="indices-row">
               {primeiraLinha.map((acao) => (
                  <div key={acao.id} className="indice-item">
                     <div className="indice-header">
                        <h3>{acao.codigo}</h3>
                        <span className="indice-nome">{acao.nome}</span>
                     </div>
                     <div className="indice-dados">
                        <span className="indice-valor">
                           {formatarMoeda(acao.valor)}
                        </span>
                        <span className={`indice-variacao ${acao.cor}`}>
                           {acao.variacao > 0 ? '+' : ''}
                           {formatarVariacao(acao.variacao)}%
                        </span>
                     </div>
                  </div>
               ))}
            </div>
            <div className="indices-row">
               {segundaLinha.map((acao) => (
                  <div key={acao.id} className="indice-item">
                     <div className="indice-header">
                        <h3>{acao.codigo}</h3>
                        <span className="indice-nome">{acao.nome}</span>
                     </div>
                     <div className="indice-dados">
                        <span className="indice-valor">
                           {formatarMoeda(acao.valor)}
                        </span>
                        <span className={`indice-variacao ${acao.cor}`}>
                           {acao.variacao > 0 ? '+' : ''}
                           {formatarVariacao(acao.variacao)}%
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <div className="indice-atualizacao">
            <span>Última atualização: {ultimaAtualizacao}</span>
            <small>Dados atualizados a cada 30 segundos</small>
         </div>
      </div>
   );
};

export default AcoesBrasil;
