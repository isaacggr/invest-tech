import React, { useState, useEffect } from 'react';
import { isMarketOpen, getNextUpdate } from '../utils/marketTime';

interface Fundo {
   id: string;
   nome: string;
   codigo: string;
   valor: number;
   variacao: number;
   cor: string;
   ultimaAtualizacao: string;
}

const FundosImobiliarios: React.FC = () => {
   const [fundos, setFundos] = useState<Fundo[]>([]);
   const [carregando, setCarregando] = useState<boolean>(true);
   const [erro, setErro] = useState<string | null>(null);
   const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>('');

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

   const buscarFundosSimulados = () => {
      try {
         setCarregando(true);

         const dadosSimulados = [
            {
               id: '1',
               nome: 'Kinea Rendimentos',
               codigo: 'KNCR11',
               valor: 101.23,
               variacao: 0.28,
            },
            {
               id: '2',
               nome: 'CSHG Logística',
               codigo: 'HGLG11',
               valor: 162.45,
               variacao: -0.32,
            },
            {
               id: '3',
               nome: 'Guardian Logística FII',
               codigo: 'GARE11',
               valor: 8.52,
               variacao: 0.0,
            },
            {
               id: '4',
               nome: 'Maxi Renda',
               codigo: 'MXRF11',
               valor: 10.35,
               variacao: 0.52,
            },
            {
               id: '5',
               nome: 'XP Malls',
               codigo: 'XPML11',
               valor: 112.89,
               variacao: -0.45,
            },
            {
               id: '6',
               nome: 'RBR Target',
               codigo: 'RZTR11',
               valor: 89.67,
               variacao: 0.38,
            },
            {
               id: '7',
               nome: 'Newport Logística',
               codigo: 'NEWL11',
               valor: 92.45,
               variacao: -0.21,
            },
            {
               id: '8',
               nome: 'HSI Shopping',
               codigo: 'HSML11',
               valor: 87.9,
               variacao: 0.19,
            },
         ].map((item) => ({
            ...item,
            cor: item.variacao >= 0 ? 'verde' : 'vermelho',
            ultimaAtualizacao: formatarDataHora(),
         }));

         setFundos(dadosSimulados);
         setUltimaAtualizacao(formatarDataHora());
         setErro(null);
      } catch (error) {
         console.error('Erro ao carregar dados simulados:', error);
         setErro('Erro ao carregar fundos imobiliários.');
      } finally {
         setCarregando(false);
      }
   };

   const buscarFundos = async () => {
      try {
         setCarregando(true);

         const fundosDesejados = [
            { symbol: 'KNCR11', nome: 'Kinea Rendimentos' },
            { symbol: 'HGLG11', nome: 'CSHG Logística' },
            { symbol: 'GARE11', nome: 'Guardian Logística FII' },
            { symbol: 'MXRF11', nome: 'Maxi Renda' },
            { symbol: 'XPML11', nome: 'XP Malls' },
            { symbol: 'RZTR11', nome: 'RBR Target' },
            { symbol: 'NEWL11', nome: 'Newport Logística' },
            { symbol: 'HSML11', nome: 'HSI Shopping' },
         ];

         const fundosProcessados = await Promise.all(
            fundosDesejados.map(async (fundo, index) => {
               try {
                  const response = await fetch(
                     `https://brapi.dev/api/quote/${fundo.symbol}?token=${
                        import.meta.env.VITE_BRAPI_TOKEN
                     }`
                  );

                  if (!response.ok) {
                     throw new Error(`Erro ao buscar ${fundo.nome}`);
                  }

                  const data = await response.json();
                  const item = data.results[0];

                  return {
                     id: String(index + 1),
                     nome: fundo.nome,
                     codigo: fundo.symbol,
                     valor: item.regularMarketPrice,
                     variacao: item.regularMarketChangePercent,
                     cor:
                        item.regularMarketChangePercent >= 0
                           ? 'verde'
                           : 'vermelho',
                     ultimaAtualizacao: formatarDataHora(),
                  };
               } catch (error) {
                  console.error(`Erro ao buscar ${fundo.nome}:`, error);
                  return null;
               }
            })
         );

         const fundosValidos = fundosProcessados.filter(
            (fundo) => fundo !== null
         );

         if (fundosValidos.length > 0) {
            setFundos(fundosValidos);
            setUltimaAtualizacao(formatarDataHora());
            setErro(null);
         } else {
            throw new Error('Nenhum fundo pôde ser carregado');
         }
      } catch (error) {
         console.error('Erro:', error);
         setErro('Erro ao carregar fundos');
         buscarFundosSimulados(); // fallback para dados simulados
      } finally {
         setCarregando(false);
      }
   };

   useEffect(() => {
      buscarFundos();
      const intervalId = setInterval(buscarFundos, 30000);
      return () => clearInterval(intervalId);
   }, []);

   const formatarMoeda = (valor: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL',
      }).format(valor);
   };

   const formatarVariacao = (variacao: number) => {
      return variacao.toFixed(2);
   };

   if (carregando && fundos.length === 0) {
      return (
         <div className="card-principal indices-card">
            <h2>Fundos Imobiliários</h2>
            <div className="mensagem-info mensagem-card">
               <p>Carregando dados dos fundos imobiliários...</p>
            </div>
         </div>
      );
   }

   const primeiraLinha = fundos.slice(0, 4);
   const segundaLinha = fundos.slice(4, 8);

   return (
      <div className="card-principal indices-card">
         <h2>Principais Fundos Imobiliários</h2>
         <div className="indices-grid">
            <div className="indices-row">
               {primeiraLinha.map((fundo) => (
                  <div key={fundo.id} className="indice-item">
                     <div className="indice-header">
                        <h3>{fundo.codigo}</h3>
                        <span className="indice-nome">{fundo.nome}</span>
                     </div>
                     <div className="indice-dados">
                        <span className="indice-valor">
                           {formatarMoeda(fundo.valor)}
                        </span>
                        <span className={`indice-variacao ${fundo.cor}`}>
                           {fundo.variacao > 0 ? '+' : ''}
                           {formatarVariacao(fundo.variacao)}%
                        </span>
                     </div>
                  </div>
               ))}
            </div>
            <div className="indices-row">
               {segundaLinha.map((fundo) => (
                  <div key={fundo.id} className="indice-item">
                     <div className="indice-header">
                        <h3>{fundo.codigo}</h3>
                        <span className="indice-nome">{fundo.nome}</span>
                     </div>
                     <div className="indice-dados">
                        <span className="indice-valor">
                           {formatarMoeda(fundo.valor)}
                        </span>
                        <span className={`indice-variacao ${fundo.cor}`}>
                           {fundo.variacao > 0 ? '+' : ''}
                           {formatarVariacao(fundo.variacao)}%
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

export default FundosImobiliarios;
