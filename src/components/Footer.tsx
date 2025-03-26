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
               <p className="disclaimer">
                  Os valores e informações apresentados são meramente ilustrativos e não
                  constituem recomendação de investimento.
               </p>
            </div>
            <div className="footer-credits">
               <p className="api-credits">
                  Dados fornecidos por{' '}
                  <a
                     href="https://brapi.dev"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="highlight"
                  >
                     BRAPI
                  </a>
               </p>
               <p className="legal-disclaimer">
                  Antes de investir, consulte um profissional qualificado e verifique seus
                  objetivos, situação financeira e necessidades individuais.
               </p>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
