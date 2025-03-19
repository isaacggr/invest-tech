import React, { useEffect, useState, useCallback } from 'react';

interface Detalhe {
   mes: number;
   rendimento: number;
   valorInvestido: number;
   valorAcumulado: number;
   aporteMensal: number;
}

interface TabelaDetalhesProps {
   detalhes: Detalhe[];
}

const TabelaDetalhes: React.FC<TabelaDetalhesProps> = React.memo(
   ({ detalhes }) => {
      const [filtroMes, setFiltroMes] = useState<string>('todos');
      const [isMobile, setIsMobile] = useState<boolean>(false);

      // Detecta se é mobile baseado no tamanho da tela
      useEffect(() => {
         const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
         };

         // Verifica imediatamente
         checkMobile();

         // Adiciona o listener
         window.addEventListener('resize', checkMobile);

         // Limpa o listener ao desmontar
         return () => {
            window.removeEventListener('resize', checkMobile);
         };
      }, []);

      // Função para filtrar dados baseado na seleção
      const filtrarDados = useCallback(() => {
         if (!detalhes || detalhes.length === 0) {
            return [];
         }

         switch (filtroMes) {
            case 'primeiro-ano':
               return detalhes.filter((item) => item.mes <= 12);
            case 'ultimo-ano':
               return detalhes.slice(-12);
            case 'intervalos':
               // Exibe apenas valores a cada 12 meses
               return detalhes.filter(
                  (item) => item.mes === 1 || item.mes % 12 === 0
               );
            case 'importantes':
               // Exibe o primeiro mês, o último e alguns importantes no meio
               const mesesImportantes = new Set([
                  1, // Primeiro mês
                  12, // 1 ano
                  24, // 2 anos
                  60, // 5 anos
                  120, // 10 anos
                  180, // 15 anos
                  240, // 20 anos
                  300, // 25 anos
                  360, // 30 anos
                  420, // 35 anos
                  480, // 40 anos
                  detalhes.length, // Último mês
               ]);
               return detalhes.filter((item) => mesesImportantes.has(item.mes));
            case 'todos':
            default:
               return detalhes;
         }
      }, [detalhes, filtroMes]);

      // Memoiza os dados filtrados
      const dadosFiltrados = useCallback(filtrarDados, [filtrarDados])();

      // Formatador de moeda
      const formatarMoeda = useCallback((valor: number) => {
         return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
         }).format(valor);
      }, []);

      // Se não houver dados, retorna uma mensagem
      if (!detalhes || detalhes.length === 0) {
         return (
            <div className="mensagem-info mensagem-card">
               <p>
                  Preencha os valores de investimento para visualizar a tabela
                  detalhada.
               </p>
               <p className="dica">
                  Ajuste os valores na calculadora para ver os detalhes mês a
                  mês.
               </p>
            </div>
         );
      }

      return (
         <div className="detalhes-mensais">
            <div className="tabela-filtro">
               <label htmlFor="filtro-mes">Exibir:</label>
               <select
                  id="filtro-mes"
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
               >
                  <option value="todos">Todos os meses</option>
                  <option value="primeiro-ano">Primeiro ano</option>
                  <option value="ultimo-ano">Último ano</option>
                  <option value="intervalos">A cada 12 meses</option>
                  <option value="importantes">Meses importantes</option>
               </select>
            </div>

            <div className="tabela-container">
               <table>
                  <thead>
                     <tr>
                        <th>Mês</th>
                        <th>Investido</th>
                        {!isMobile && <th>Aporte</th>}
                        <th>Rendimento</th>
                        <th>Total</th>
                     </tr>
                  </thead>
                  <tbody>
                     {dadosFiltrados.map((item, index) => (
                        <tr
                           key={item.mes}
                           className={
                              index % 2 === 0 ? 'linha-par' : 'linha-impar'
                           }
                        >
                           <td>{item.mes}</td>
                           <td>{formatarMoeda(item.valorInvestido)}</td>
                           {!isMobile && (
                              <td>{formatarMoeda(item.aporteMensal)}</td>
                           )}
                           <td>{formatarMoeda(item.rendimento)}</td>
                           <td>{formatarMoeda(item.valorAcumulado)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {dadosFiltrados.length > 10 && (
               <div className="tabela-info">
                  {filtroMes === 'todos'
                     ? 'Deslize horizontalmente para ver mais colunas e verticalmente para ver todos os meses.'
                     : 'Exibindo ' +
                       dadosFiltrados.length +
                       ' de ' +
                       detalhes.length +
                       ' meses.'}
               </div>
            )}
         </div>
      );
   }
);

export default TabelaDetalhes;
