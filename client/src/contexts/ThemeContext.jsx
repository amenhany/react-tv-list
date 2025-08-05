import { createContext, useEffect, useState } from 'react';


export const ThemeContext = createContext({
  isDarkMode: false,
  setIsDarkMode: () => {}
});


export default function ThemeProvider({ children }) {
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
    document.body.setAttribute("data-bs-theme", theme);
  }, [isDarkMode]);


  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}