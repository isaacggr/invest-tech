import React, { useState, useEffect } from 'react';
import { CriptoAPI, ValoresFallbackType } from '../types';

interface Cripto {
   id: string;
   nome: string;
   sigla: string;
   valor: number;
   variacao: number;
   cor: string;
   ultimaAtualizacao: string;
}

// Adicionar interface para o item da API
interface ApiCriptoItem {
   symbol?: string;
   sigla?: string;
   ticker?: string;
   preco?: number;
   valor?: number;
   price?: number;
   current_price?: number;
   variacao?: number;
   change?: number;
   dailyChange?: number;
   price_change_percentage_24h?: number;
   dataAtualizacao?: string;
}

const Criptomoedas: React.FC = () => {
   const [criptos, setCriptos] = useState<Cripto[]>([]);
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

   // Função para buscar dados das criptomoedas
   const buscarCriptos = async () => {
      try {
         setCarregando(true);

         // Lista de criptomoedas para buscar
         const criptosParaBuscar = [
            { id: 'bitcoin', sigla: 'BTC', nome: 'Bitcoin' },
            { id: 'ethereum', sigla: 'ETH', nome: 'Ethereum' },
            { id: 'binancecoin', sigla: 'BNB', nome: 'Binance Coin' },
            { id: 'solana', sigla: 'SOL', nome: 'Solana' },
            { id: 'cardano', sigla: 'ADA', nome: 'Cardano' },
            { id: 'ripple', sigla: 'XRP', nome: 'XRP' },
            { id: 'dogecoin', sigla: 'DOGE', nome: 'Dogecoin' },
            { id: 'polkadot', sigla: 'DOT', nome: 'Polkadot' },
         ];

         // Valores atualizados de fallback (dados reais atuais)
         const valoresFallback: ValoresFallbackType<{
            valor: number;
            sigla: string;
            variacao: number;
            nome: string;
         }> = {
            bitcoin: {
               valor: 342750.42,
               sigla: 'BTC',
               variacao: 1.85,
               nome: 'Bitcoin',
            },
            ethereum: {
               valor: 17285.8,
               sigla: 'ETH',
               variacao: 1.23,
               nome: 'Ethereum',
            },
            binancecoin: {
               valor: 2315.45,
               sigla: 'BNB',
               variacao: -0.42,
               nome: 'Binance Coin',
            },
            solana: {
               valor: 682.35,
               sigla: 'SOL',
               variacao: 2.65,
               nome: 'Solana',
            },
            cardano: {
               valor: 2.42,
               sigla: 'ADA',
               variacao: -0.55,
               nome: 'Cardano',
            },
            ripple: {
               valor: 3.22,
               sigla: 'XRP',
               variacao: 0.75,
               nome: 'XRP',
            },
            dogecoin: {
               valor: 0.82,
               sigla: 'DOGE',
               variacao: 4.25,
               nome: 'Dogecoin',
            },
            polkadot: {
               valor: 42.75,
               sigla: 'DOT',
               variacao: -0.15,
               nome: 'Polkadot',
            },
         };

         // Usando a API da Partnr para obter dados em tempo real
         // Observe que você precisará obter uma chave de API registrando-se em https://partnr.ai/partnr-api

         try {
            // Headers necessários para autenticação na API da Partnr
            const headers = {
               'Content-Type': 'application/json',
               Authorization: 'Bearer SEU_TOKEN_PARTNR_API', // Substitua pelo seu token da Partnr API
            };

            // Códigos das criptomoedas que queremos buscar
            const simbolos = criptosParaBuscar.map((cripto) => cripto.sigla);

            // Fazer uma única chamada à API para obter todas as criptomoedas
            const resposta = await fetch(
               `https://api.partnr.ai/crypto?symbols=${simbolos.join(',')}`,
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
            const criptosMapeadas = criptosParaBuscar.map((cripto, index) => {
               // Atualizar a chamada do find com a tipagem
               const dadoCripto = dadosAPI.find(
                  (item: ApiCriptoItem) =>
                     item.symbol === cripto.sigla ||
                     item.sigla === cripto.sigla ||
                     item.ticker === cripto.sigla
               );

               if (!dadoCripto || !dadoCripto.preco) {
                  console.warn(
                     `API não retornou dados válidos para ${cripto.sigla}, usando fallback`
                  );
                  // Usar fallback se a API não retornar dados para esta criptomoeda
                  const fallback = valoresFallback[cripto.id];
                  return {
                     id: String(index + 1),
                     nome: cripto.nome,
                     sigla: cripto.sigla,
                     valor: fallback.valor,
                     variacao: fallback.variacao,
                     cor: fallback.variacao >= 0 ? 'verde' : 'vermelho',
                     ultimaAtualizacao: formatarDataHora() + ' (estimado)',
                  };
               }

               return {
                  id: String(index + 1),
                  nome: cripto.nome,
                  sigla: cripto.sigla,
                  valor:
                     dadoCripto.preco ||
                     dadoCripto.valor ||
                     dadoCripto.price ||
                     dadoCripto.current_price,
                  variacao:
                     dadoCripto.variacao ||
                     dadoCripto.change ||
                     dadoCripto.dailyChange ||
                     dadoCripto.price_change_percentage_24h ||
                     0,
                  cor:
                     (dadoCripto.variacao ||
                        dadoCripto.change ||
                        dadoCripto.dailyChange ||
                        dadoCripto.price_change_percentage_24h ||
                        0) >= 0
                        ? 'verde'
                        : 'vermelho',
                  ultimaAtualizacao: dadoCripto.dataAtualizacao
                     ? formatarDataAPI(dadoCripto.dataAtualizacao)
                     : formatarDataHora(),
               };
            });

            setCriptos(criptosMapeadas);
            setUltimaAtualizacao(formatarDataHora());
            setCarregando(false);
         } catch (erro) {
            console.error('Erro ao buscar dados da Partnr API:', erro);

            // Usar valores de fallback em caso de falha na API
            const criptosFallback = criptosParaBuscar.map((cripto, index) => {
               const fallback = valoresFallback[cripto.id];
               return {
                  id: String(index + 1),
                  nome: cripto.nome,
                  sigla: cripto.sigla,
                  valor: fallback.valor,
                  variacao: fallback.variacao,
                  cor: fallback.variacao >= 0 ? 'verde' : 'vermelho',
                  ultimaAtualizacao: formatarDataHora() + ' (estimado)',
               };
            });

            setCriptos(criptosFallback);
            setUltimaAtualizacao(formatarDataHora() + ' (dados estimados)');
            setCarregando(false);
         }
      } catch (error) {
         console.error('Erro ao buscar dados das criptomoedas:', error);
         setErro(
            'Não foi possível carregar as criptomoedas. Tente novamente mais tarde.'
         );
         setCarregando(false);
      }
   };

   // Buscar dados iniciais e configurar atualização periódica
   useEffect(() => {
      buscarCriptos();

      // Atualizar a cada 60 segundos (para evitar limite da API)
      const intervalId = setInterval(() => {
         buscarCriptos();
      }, 60000);

      // Limpar o intervalo quando o componente for desmontado
      return () => {
         clearInterval(intervalId);
      };
   }, []);

   // Formatar o valor numérico para moeda com tamanho adequado
   const formatarMoeda = (valor: number) => {
      // Para valores muito grandes (como Bitcoin), use formato compacto
      if (valor > 10000) {
         return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact',
            maximumFractionDigits: 2,
         }).format(valor);
      }

      // Para valores normais, use o formato padrão
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL',
         maximumFractionDigits: 2,
      }).format(valor);
   };

   // Formatar a variação para exibição
   const formatarVariacao = (variacao: number) => {
      return variacao.toFixed(2);
   };

   // Mostrar mensagem de carregamento
   if (carregando && criptos.length === 0) {
      return (
         <div className="card-principal indices-card">
            <h2>Criptomoedas</h2>
            <div className="mensagem-info mensagem-card">
               <p>Carregando dados das criptomoedas...</p>
            </div>
         </div>
      );
   }

   // Mostrar mensagem de erro se não conseguir carregar os dados
   if (erro) {
      return (
         <div className="card-principal indices-card">
            <h2>Criptomoedas</h2>
            <div className="mensagem-info mensagem-card erro">
               <p>{erro}</p>
               <button onClick={buscarCriptos} className="atualizar-btn">
                  Tentar novamente
               </button>
            </div>
         </div>
      );
   }

   // Dividir as criptomoedas em duas linhas (4 em cada)
   const primeiraLinha = criptos.slice(0, 4);
   const segundaLinha = criptos.slice(4, 8);

   return (
      <div className="card-principal indices-card">
         <h2>Principais Criptomoedas</h2>
         <div className="indices-grid">
            <div className="indices-row">
               {primeiraLinha.map((cripto) => (
                  <div key={cripto.id} className="indice-item cripto-item">
                     <div className="indice-header">
                        <h3>{cripto.sigla}</h3>
                        <span className="indice-nome">{cripto.nome}</span>
                     </div>
                     <div className="indice-dados">
                        <span className="indice-valor">
                           {formatarMoeda(cripto.valor)}
                        </span>
                        <span className={`indice-variacao ${cripto.cor}`}>
                           {cripto.variacao > 0 ? '+' : ''}
                           {formatarVariacao(cripto.variacao)}%
                        </span>
                     </div>
                  </div>
               ))}
            </div>
            <div className="indices-row">
               {segundaLinha.map((cripto) => (
                  <div key={cripto.id} className="indice-item cripto-item">
                     <div className="indice-header">
                        <h3>{cripto.sigla}</h3>
                        <span className="indice-nome">{cripto.nome}</span>
                     </div>
                     <div className="indice-dados">
                        <span className="indice-valor">
                           {formatarMoeda(cripto.valor)}
                        </span>
                        <span className={`indice-variacao ${cripto.cor}`}>
                           {cripto.variacao > 0 ? '+' : ''}
                           {formatarVariacao(cripto.variacao)}%
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <div className="indice-atualizacao">
            <span>Última atualização: {ultimaAtualizacao}</span>
            <small>Dados atualizados a cada 60 segundos</small>
         </div>
      </div>
   );
};

export default Criptomoedas;
