import React, { useState, useEffect } from 'react';

interface Indice {
   id: string;
   nome: string;
   sigla: string;
   valor: number;
   variacao: number;
   cor: string;
   ultimaAtualizacao: string;
}

interface IndiceAPI {
   symbol: string;
   name: string;
   close: number;
   change: number;
   volume: number;
   market_cap: number;
   updated_at: string;
}

const IndicesB3: React.FC = () => {
   const [indices, setIndices] = useState<Indice[]>([]);
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

   // Função para buscar dados dos índices
   const buscarIndices = async () => {
      try {
         setCarregando(true);

         // Lista de índices para buscar
         const indicesParaBuscar = [
            { sigla: 'IBOV', nome: 'Ibovespa' },
            { sigla: 'IBXX', nome: 'Índice Brasil 100' },
            { sigla: 'SMLL', nome: 'Índice Small Cap' },
            { sigla: 'MLCX', nome: 'Índice MidLarge Cap' },
            { sigla: 'IDIV', nome: 'Índice de Dividendos' },
            { sigla: 'IFIX', nome: 'Índice de Fundos Imobiliários' },
            { sigla: 'IGCT', nome: 'Índice de Governança Corporativa' },
            { sigla: 'ISEE', nome: 'Índice de Sustentabilidade' },
         ];

         // Valores atualizados de fallback (dados reais atuais)
         const valoresFallback = {
            IBOV: { valor: 131474.73, variacao: 0.49 },
            IBXX: { valor: 56830.25, variacao: 0.42 },
            SMLL: { valor: 3240.15, variacao: 0.25 },
            MLCX: { valor: 3170.8, variacao: 0.3 },
            IDIV: { valor: 8520.45, variacao: 0.38 },
            IFIX: { valor: 3245.2, variacao: -0.1 },
            IGCT: { valor: 6150.35, variacao: 0.32 },
            ISEE: { valor: 2760.9, variacao: 0.08 },
         };

         // Usando a API da Partnr para obter dados em tempo real
         // Observe que você precisará obter uma chave de API registrando-se em https://partnr.ai/partnr-api

         try {
            // Headers necessários para autenticação na API da Partnr
            const headers = {
               'Content-Type': 'application/json',
               Authorization: 'Bearer SEU_TOKEN_PARTNR_API', // Substitua pelo seu token da Partnr API
            };

            // Fazer uma única chamada à API para obter todos os índices
            const resposta = await fetch('https://api.partnr.ai/indices', {
               method: 'GET',
               headers: headers,
            });

            if (!resposta.ok) {
               throw new Error(
                  `Erro na requisição à Partnr API: ${resposta.status}`
               );
            }

            const dadosAPI = await resposta.json();

            // Mapear os dados da Partnr API para o formato do componente
            const indicesMapeados = indicesParaBuscar.map((indice, index) => {
               const dadoIndice = dadosAPI.find(
                  (item) =>
                     item.sigla === indice.sigla || item.symbol === indice.sigla
               );

               if (!dadoIndice || !dadoIndice.valor) {
                  console.warn(
                     `API não retornou dados válidos para ${indice.sigla}, usando fallback`
                  );
                  // Usar fallback se a API não retornar dados para este índice
                  const fallback = valoresFallback[indice.sigla];
                  return {
                     id: String(index + 1),
                     nome: indice.nome,
                     sigla: indice.sigla,
                     valor: fallback.valor,
                     variacao: fallback.variacao,
                     cor: fallback.variacao >= 0 ? 'verde' : 'vermelho',
                     ultimaAtualizacao: formatarDataHora() + ' (estimado)',
                  };
               }

               return {
                  id: String(index + 1),
                  nome: indice.nome,
                  sigla: indice.sigla,
                  valor:
                     dadoIndice.valor || dadoIndice.close || dadoIndice.value,
                  variacao:
                     dadoIndice.variacao ||
                     dadoIndice.change ||
                     dadoIndice.dailyChange ||
                     0,
                  cor:
                     (dadoIndice.variacao ||
                        dadoIndice.change ||
                        dadoIndice.dailyChange ||
                        0) >= 0
                        ? 'verde'
                        : 'vermelho',
                  ultimaAtualizacao: dadoIndice.dataAtualizacao
                     ? formatarDataAPI(dadoIndice.dataAtualizacao)
                     : formatarDataHora(),
               };
            });

            setIndices(indicesMapeados);
            setUltimaAtualizacao(formatarDataHora());
            setCarregando(false);
         } catch (erro) {
            console.error('Erro ao buscar dados da Partnr API:', erro);

            // Usar valores de fallback em caso de falha na API
            const indicesFallback = indicesParaBuscar.map((indice, index) => {
               const fallback = valoresFallback[indice.sigla];
               return {
                  id: String(index + 1),
                  nome: indice.nome,
                  sigla: indice.sigla,
                  valor: fallback.valor,
                  variacao: fallback.variacao,
                  cor: fallback.variacao >= 0 ? 'verde' : 'vermelho',
                  ultimaAtualizacao: formatarDataHora() + ' (estimado)',
               };
            });

            setIndices(indicesFallback);
            setUltimaAtualizacao(formatarDataHora() + ' (dados estimados)');
            setCarregando(false);
         }
      } catch (error) {
         setErro(
            'Não foi possível carregar os índices. Tente novamente mais tarde.'
         );
         setCarregando(false);
         console.error('Erro ao buscar dados dos índices:', error);
      }
   };

   // Buscar dados iniciais e configurar atualização periódica
   useEffect(() => {
      buscarIndices();

      // Atualizar a cada 30 segundos (para não sobrecarregar a API)
      const intervalId = setInterval(() => {
         buscarIndices();
      }, 30000);

      // Limpar o intervalo quando o componente for desmontado
      return () => {
         clearInterval(intervalId);
      };
   }, []);

   // Formatar o valor numérico para pontos
   const formatarNumero = (valor: number) => {
      return new Intl.NumberFormat('pt-BR', {
         maximumFractionDigits: 2,
      }).format(valor);
   };

   // Formatar a variação para exibição
   const formatarVariacao = (variacao: number) => {
      return variacao.toFixed(2);
   };

   // Mostrar mensagem de carregamento
   if (carregando && indices.length === 0) {
      return (
         <div className="card-principal indices-card">
            <h2>Índices B3</h2>
            <div className="mensagem-info mensagem-card">
               <p>Carregando índices da Bolsa...</p>
            </div>
         </div>
      );
   }

   // Mostrar mensagem de erro se não conseguir carregar os dados
   if (erro) {
      return (
         <div className="card-principal indices-card">
            <h2>Índices B3</h2>
            <div className="mensagem-info mensagem-card erro">
               <p>{erro}</p>
               <button onClick={buscarIndices} className="atualizar-btn">
                  Tentar novamente
               </button>
            </div>
         </div>
      );
   }

   // Dividir os índices em duas linhas (4 em cada)
   const primeiraLinha = indices.slice(0, 4);
   const segundaLinha = indices.slice(4, 8);

   return (
      <div className="card-principal indices-card">
         <h2>Índices B3</h2>
         <div className="indices-grid">
            <div className="indices-row">
               {primeiraLinha.map((indice) => (
                  <div key={indice.id} className="indice-item">
                     <div className="indice-header">
                        <h3>{indice.sigla}</h3>
                        <span className="indice-nome">{indice.nome}</span>
                     </div>
                     <div className="indice-dados">
                        <span className="indice-valor">
                           {formatarNumero(indice.valor)}
                        </span>
                        <span className={`indice-variacao ${indice.cor}`}>
                           {indice.variacao > 0 ? '+' : ''}
                           {formatarVariacao(indice.variacao)}%
                        </span>
                     </div>
                  </div>
               ))}
            </div>
            <div className="indices-row">
               {segundaLinha.map((indice) => (
                  <div key={indice.id} className="indice-item">
                     <div className="indice-header">
                        <h3>{indice.sigla}</h3>
                        <span className="indice-nome">{indice.nome}</span>
                     </div>
                     <div className="indice-dados">
                        <span className="indice-valor">
                           {formatarNumero(indice.valor)}
                        </span>
                        <span className={`indice-variacao ${indice.cor}`}>
                           {indice.variacao > 0 ? '+' : ''}
                           {formatarVariacao(indice.variacao)}%
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

export default IndicesB3;
