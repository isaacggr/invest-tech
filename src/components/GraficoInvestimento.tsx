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
   type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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

interface DadosMensais {
   mes: number;
   totalInvestido: number;
   jurosAcumulado: number;
   totalAcumulado: number;
}

interface GraficoInvestimentoProps {
   dadosMensais: DadosMensais[];
}

const GraficoInvestimento: React.FC<GraficoInvestimentoProps> = React.memo(
   ({ dadosMensais }) => {
      const [isMobile, setIsMobile] = useState<boolean>(
         window.innerWidth < 768
      );

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

      if (!dadosMensais || dadosMensais.length === 0) {
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

      const graficoData = {
         labels: dadosMensais.map((item) =>
            isMobile ? `${item.mes}` : `Mês ${item.mes}`
         ),
         datasets: [
            {
               label: 'Valor Investido',
               data: dadosMensais.map((item) => item.totalInvestido),
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
               data: dadosMensais.map((item) => item.jurosAcumulado),
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
               data: dadosMensais.map((item) => item.totalAcumulado),
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

      const graficoOptions: ChartOptions<'line'> = {
         responsive: true,
         maintainAspectRatio: false,
         animation: {
            duration: 1000,
         },
         interaction: {
            mode: 'index',
            intersect: false,
         },
         plugins: {
            legend: {
               position: 'top',
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
               type: 'linear',
               grid: {
                  display: true,
                  color: 'rgba(0,0,0,0.1)',
               },
               ticks: {
                  callback: (value) => {
                     return new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        notation: 'compact',
                     }).format(Number(value));
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
