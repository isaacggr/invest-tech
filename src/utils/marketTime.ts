export const MARKET_HOURS = {
   OPEN: 10, // Mercado abre às 10:00
   CLOSE: 17, // Mercado fecha às 17:00
};

export const isMarketOpen = (): boolean => {
   const now = new Date();
   const hour = now.getHours();
   const minutes = now.getMinutes();
   const day = now.getDay();

   // Retorna falso para finais de semana (0 = Domingo, 6 = Sábado)
   if (day === 0 || day === 6) return false;

   // Verifica se está dentro do horário de funcionamento
   return hour >= MARKET_HOURS.OPEN && hour < MARKET_HOURS.CLOSE;
};

export const getNextUpdate = (): Date => {
   const now = new Date();
   const next = new Date(now);

   if (isMarketOpen()) {
      // Se o mercado está aberto, próxima atualização será no fechamento
      next.setHours(MARKET_HOURS.CLOSE, 0, 0, 0);
   } else {
      // Se o mercado está fechado, próxima atualização será na abertura do próximo dia útil
      next.setDate(next.getDate() + 1);
      next.setHours(MARKET_HOURS.OPEN, 0, 0, 0);

      // Se for sexta, pula para segunda
      if (next.getDay() === 6) {
         next.setDate(next.getDate() + 2);
      }
   }

   return next;
};
