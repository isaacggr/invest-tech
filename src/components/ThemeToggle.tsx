import React, { useState, useEffect } from 'react';

const ThemeToggle: React.FC = () => {
   const [isDark, setIsDark] = useState(() => {
      const savedTheme = localStorage.getItem('theme');
      return (
         savedTheme === 'dark' ||
         (!savedTheme &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
   });

   useEffect(() => {
      // Adiciona classe de transição após o carregamento inicial
      document.documentElement.classList.add('theme-transition');

      if (isDark) {
         document.documentElement.classList.add('dark-mode');
         localStorage.setItem('theme', 'dark');
      } else {
         document.documentElement.classList.remove('dark-mode');
         localStorage.setItem('theme', 'light');
      }

      // Remove classe de transição após a mudança
      const timeout = setTimeout(() => {
         document.documentElement.classList.remove('theme-transition');
      }, 500);

      return () => clearTimeout(timeout);
   }, [isDark]);

   return (
      <button
         onClick={() => setIsDark(!isDark)}
         className="theme-toggle"
         aria-label={`Mudar para modo ${isDark ? 'claro' : 'escuro'}`}
         title={`Mudar para modo ${isDark ? 'claro' : 'escuro'}`}
      >
         <div className="theme-toggle-track">
            <div className="theme-toggle-thumb"></div>
            <svg
               className="theme-toggle-sun"
               viewBox="0 0 24 24"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               />
               <path
                  d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               />
            </svg>
            <svg
               className="theme-toggle-moon"
               viewBox="0 0 24 24"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               />
            </svg>
         </div>
      </button>
   );
};

export default ThemeToggle;
