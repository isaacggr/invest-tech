export interface Detalhe {
   mes: number;
   rendimento: number;
   valorInvestido: number;
   valorAcumulado: number;
   aporteMensal: number;
}

export interface DadosMensais {
   mes: number;
   valorInvestido: number;
   rendimento: number;
   valorAcumulado: number;
   aporteMensal: number;
   totalInvestido: number;
   jurosAcumulado: number;
   totalAcumulado: number;
}

export interface ResultadoCalculo {
   totalInvestido: number;
   totalRendimentos: number;
   totalFinal: number;
}

// Interfaces para APIs
export interface IndiceAPI {
   sigla?: string;
   symbol: string;
   name: string;
   close: number;
   change: number;
   value?: number;
   valor?: number;
   variacao?: number;
   dailyChange?: number;
   dataAtualizacao?: string;
}

export interface AcaoAPI {
   symbol: string;
   name: string;
   close: number;
   change: number;
}

export interface CriptoAPI {
   symbol: string;
   name: string;
   current_price: number;
   price_change_percentage_24h: number;
}

// Tipos para os valores de fallback
export type ValoresFallbackType<T> = {
   [key: string]: T;
};
