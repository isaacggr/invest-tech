import React from 'react';

const Footer: React.FC = () => {
   const ano = new Date().getFullYear();

   return (
      <footer className="site-footer">
         <div className="footer-container">
            <div className="footer-info">
               <p className="copyright">© {ano} Calculadora de Investimentos</p>
               <p className="developer">
                  Desenvolvido por{' '}
                  <a
                     href="https://github.com/isaacggr"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="highlight"
                  >
                     Isaac Gregorio
                  </a>
               </p>
            </div>
            <div className="footer-credits">
               <p className="api-credits">
                  Dados fornecidos por{' '}
                  <a
                     href="https://b3api.me/docs"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="highlight"
                  >
                     B3API
                  </a>
               </p>
               <p className="disclaimer">
                  Valores simulados apenas para fins educacionais
               </p>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
