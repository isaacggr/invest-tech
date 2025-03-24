import React, { useState, useEffect } from 'react';
import { AcaoAPI, ValoresFallbackType } from '../types';

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
interface ApiItem {
   ticker?: string;
   symbol?: string;
   codigo?: string;
   preco?: number;
   valor?: number;
   close?: number;
   price?: number;
   variacao?: number;
   change?: number;
   dailyChange?: number;
   dataAtualizacao?: string;
}

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

   // Função para buscar dados das ações
   const buscarAcoes = async () => {
      try {
         setCarregando(true);

         // Lista de ações para buscar
         const acoesParaBuscar = [
            { codigo: 'PETR4', nome: 'Petrobras' },
            { codigo: 'VALE3', nome: 'Vale' },
            { codigo: 'ITUB4', nome: 'Itaú Unibanco' },
            { codigo: 'BBDC4', nome: 'Bradesco' },
            { codigo: 'ABEV3', nome: 'Ambev' },
            { codigo: 'B3SA3', nome: 'B3' },
            { codigo: 'MGLU3', nome: 'Magazine Luiza' },
            { codigo: 'WEGE3', nome: 'WEG' },
         ];

         // Valores atualizados de fallback (dados reais atuais)
         const valoresFallback: ValoresFallbackType<{
            valor: number;
            variacao: number;
         }> = {
            PETR4: { valor: 37.92, variacao: 0.85 },
            VALE3: { valor: 66.85, variacao: -0.48 },
            ITUB4: { valor: 34.92, variacao: 0.56 },
            BBDC4: { valor: 15.85, variacao: 0.33 },
            ABEV3: { valor: 13.42, variacao: -0.2 },
            B3SA3: { valor: 12.78, variacao: 0.42 },
            MGLU3: { valor: 1.89, variacao: 2.45 },
            WEGE3: { valor: 36.82, variacao: 0.22 },
         };

         // Usando a API da Partnr para obter dados em tempo real
         // Observe que você precisará obter uma chave de API registrando-se em https://partnr.ai/partnr-api

         try {
            // Headers necessários para autenticação na API da Partnr
            const headers = {
               'Content-Type': 'application/json',
               Authorization: 'Bearer SEU_TOKEN_PARTNR_API', // Substitua pelo seu token da Partnr API
            };

            // Códigos das ações que queremos buscar
            const simbolos = acoesParaBuscar.map((acao) => acao.codigo);

            // Fazer uma única chamada à API para obter todas as ações
            const resposta = await fetch(
               `https://api.partnr.ai/cotacoes?symbols=${simbolos.join(',')}`,
               {
                  method: 'GET',
                  headers: headers,
               }
            );

            if (!resposta.ok) {
               throw new Error(
                  `Erro na requisição à Partnr API: ${resposta.status}`
               );
            }

            const dadosAPI = await resposta.json();

            // Mapear os dados da Partnr API para o formato do componente
            const acoesMapeadas = acoesParaBuscar.map((acao, index) => {
               // Atualizar a chamada do find com a tipagem
               const dadoAcao = dadosAPI.find(
                  (item: ApiItem) =>
                     item.ticker === acao.codigo ||
                     item.symbol === acao.codigo ||
                     item.codigo === acao.codigo
               );

               if (!dadoAcao || !dadoAcao.preco) {
                  console.warn(
                     `API não retornou dados válidos para ${acao.codigo}, usando fallback`
                  );
                  // Usar fallback se a API não retornar dados para esta ação
                  const fallback = valoresFallback[acao.codigo];
                  return {
                     id: String(index + 1),
                     nome: acao.nome,
                     codigo: acao.codigo,
                     valor: fallback.valor,
                     variacao: fallback.variacao,
                     cor: fallback.variacao >= 0 ? 'verde' : 'vermelho',
                     ultimaAtualizacao: formatarDataHora() + ' (estimado)',
                  };
               }

               return {
                  id: String(index + 1),
                  nome: acao.nome,
                  codigo: acao.codigo,
                  valor:
                     dadoAcao.preco ||
                     dadoAcao.valor ||
                     dadoAcao.close ||
                     dadoAcao.price,
                  variacao:
                     dadoAcao.variacao ||
                     dadoAcao.change ||
                     dadoAcao.dailyChange ||
                     0,
                  cor:
                     (dadoAcao.variacao ||
                        dadoAcao.change ||
                        dadoAcao.dailyChange ||
                        0) >= 0
                        ? 'verde'
                        : 'vermelho',
                  ultimaAtualizacao: dadoAcao.dataAtualizacao
                     ? formatarDataAPI(dadoAcao.dataAtualizacao)
                     : formatarDataHora(),
               };
            });

            setAcoes(acoesMapeadas);
            setUltimaAtualizacao(formatarDataHora());
            setCarregando(false);
         } catch (erro) {
            console.error('Erro ao buscar dados da Partnr API:', erro);

            // Usar valores de fallback em caso de falha na API
            const acoesFallback = acoesParaBuscar.map((acao, index) => {
               const fallback = valoresFallback[acao.codigo];
               return {
                  id: String(index + 1),
                  nome: acao.nome,
                  codigo: acao.codigo,
                  valor: fallback.valor,
                  variacao: fallback.variacao,
                  cor: fallback.variacao >= 0 ? 'verde' : 'vermelho',
                  ultimaAtualizacao: formatarDataHora() + ' (estimado)',
               };
            });

            setAcoes(acoesFallback);
            setUltimaAtualizacao(formatarDataHora() + ' (dados estimados)');
            setCarregando(false);
         }
      } catch (error) {
         setErro(
            'Não foi possível carregar as ações. Tente novamente mais tarde.'
         );
         setCarregando(false);
         console.error('Erro ao buscar dados das ações:', error);
      }
   };

   // Buscar dados iniciais e configurar atualização periódica
   useEffect(() => {
      buscarAcoes();

      // Atualizar a cada 30 segundos (para não sobrecarregar a API)
      const intervalId = setInterval(() => {
         buscarAcoes();
      }, 30000);

      // Limpar o intervalo quando o componente for desmontado
      return () => {
         clearInterval(intervalId);
      };
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
