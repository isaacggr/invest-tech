export const API = {
   baseUrl: 'https://brapi.dev/api',
   token: import.meta.env.VITE_BRAPI_TOKEN,
};

export const buildUrl = (endpoint: string) => {
   const cleanEndpoint = endpoint.startsWith('/')
      ? endpoint.slice(1)
      : endpoint;
   return `${API.baseUrl}/${cleanEndpoint}?token=${API.token}`;
};

export interface BrapiResponse<T> {
   results: T[];
   requestedAt: string;
   took: string;
}

export interface MarketQuote {
   symbol: string;
   shortName: string;
   longName: string;
   currency: string;
   regularMarketPrice: number;
   regularMarketChangePercent: number;
   regularMarketChange: number;
   regularMarketTime: string;
   marketCap: number;
   regularMarketVolume: number;
}

export interface BrapiQuoteItem {
   symbol: string;
   shortName: string;
   longName: string;
   currency: string;
   regularMarketPrice: number;
   regularMarketChangePercent: number;
   regularMarketChange: number;
   regularMarketTime: string;
}

export interface BrapiCryptoItem {
   coin: string;
   coinName: string;
   currency: string;
   regularMarketPrice: number;
   regularMarketChangePercent: number;
   regularMarketChange: number;
   regularMarketTime: string;
}

export const fetchMarketData = async <T>(endpoint: string): Promise<T> => {
   try {
      const url = buildUrl(endpoint);
      console.log('Fazendo requisição para:', url);

      const response = await fetch(url);

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error('Erro na requisição:', error.message);
      }
      throw error;
   }
};

export const BRAPI_ENDPOINTS = {
   quote: '/quote',
   crypto: '/v2/crypto',
};
