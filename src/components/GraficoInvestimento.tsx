import React, { useState, useEffect } from 'react';
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
   Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
   Filler
);

interface Dados {
   mes: number;
   rendimento: number;
   valorInvestido: number;
   valorAcumulado: number;
}

interface GraficoInvestimentoProps {
   dados: Dados[];
}

const GraficoInvestimento: React.FC<GraficoInvestimentoProps> = React.memo(
   ({ dados }) => {
      const [isMobile, setIsMobile] = useState<boolean>(
         window.innerWidth < 768
      );

      // Detecta dispositivo móvel
      useEffect(() => {
         const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
         };

         checkMobile();
         window.addEventListener('resize', checkMobile);

         return () => {
            window.removeEventListener('resize', checkMobile);
         };
      }, []);

      // Se não houver dados, mostra mensagem
      if (!dados || dados.length === 0) {
         return (
            <div className="mensagem-info mensagem-card">
               <p>
                  Preencha os valores de investimento para visualizar o gráfico.
               </p>
               <p className="dica">
                  Ajuste os valores na calculadora para ver sua evolução
                  patrimonial.
               </p>
            </div>
         );
      }

      // Filtra os dados para dispositivos móveis
      const filtrarDados = () => {
         if (!isMobile || dados.length <= 36) {
            return dados;
         }

         const intervalo = Math.max(1, Math.floor(dados.length / 36));
         return dados.filter(
            (_, index) =>
               index === 0 ||
               index === dados.length - 1 ||
               index % intervalo === 0 ||
               dados[index].mes % 12 === 0 // Incluir anos completos
         );
      };

      const dadosFiltrados = filtrarDados();

      // Preparar dados para o gráfico
      const graficoData = {
         labels: dadosFiltrados.map((item) =>
            isMobile ? `${item.mes}` : `Mês ${item.mes}`
         ),
         datasets: [
            {
               label: 'Valor Investido',
               data: dadosFiltrados.map((item) => item.valorInvestido),
               borderColor: '#6366f1',
               backgroundColor: 'rgba(99, 102, 241, 0.1)',
               fill: true,
               tension: 0.3,
               pointRadius: isMobile ? 0 : 2,
               pointHoverRadius: 4,
               borderWidth: 2,
            },
            {
               label: 'Rendimentos',
               data: dadosFiltrados.map(
                  (item) => item.valorAcumulado - item.valorInvestido
               ),
               borderColor: '#10b981',
               backgroundColor: 'rgba(16, 185, 129, 0.1)',
               fill: true,
               tension: 0.3,
               pointRadius: isMobile ? 0 : 2,
               pointHoverRadius: 4,
               borderWidth: 2,
            },
            {
               label: 'Valor Total',
               data: dadosFiltrados.map((item) => item.valorAcumulado),
               borderColor: '#f59e0b',
               backgroundColor: 'rgba(245, 158, 11, 0.1)',
               fill: false,
               tension: 0.3,
               pointRadius: isMobile ? 0 : 2,
               pointHoverRadius: 4,
               borderWidth: 2,
            },
         ],
      };

      // Opções do gráfico
      const graficoOptions = {
         responsive: true,
         maintainAspectRatio: false,
         animation: {
            duration: 1000,
         },
         interaction: {
            mode: 'index' as const,
            intersect: false,
         },
         plugins: {
            legend: {
               position: 'top' as const,
               labels: {
                  boxWidth: 12,
                  padding: isMobile ? 10 : 20,
                  font: {
                     size: isMobile ? 10 : 12,
                  },
               },
            },
            tooltip: {
               padding: 10,
               boxPadding: 3,
               callbacks: {
                  label: function (context: any) {
                     let label = context.dataset.label || '';
                     if (label) label += ': ';
                     if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat('pt-BR', {
                           style: 'currency',
                           currency: 'BRL',
                        }).format(context.parsed.y);
                     }
                     return label;
                  },
               },
            },
         },
         scales: {
            x: {
               grid: {
                  display: !isMobile,
               },
               ticks: {
                  maxRotation: isMobile ? 0 : 50,
                  autoSkip: true,
                  maxTicksLimit: isMobile ? 6 : 12,
                  font: {
                     size: isMobile ? 8 : 10,
                  },
               },
            },
            y: {
               grid: {
                  drawBorder: false,
               },
               ticks: {
                  callback: function (value: any) {
                     return new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        notation: 'compact',
                        compactDisplay: 'short',
                     }).format(value);
                  },
                  font: {
                     size: isMobile ? 9 : 11,
                  },
               },
            },
         },
      };

      return (
         <div className="grafico-container">
            <Line data={graficoData} options={graficoOptions} />
         </div>
      );
   }
);

export default GraficoInvestimento;
