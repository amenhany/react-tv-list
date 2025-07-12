import { createContext, useState } from "react";

export const DimmerContext = createContext();

export default function DimmerProvider({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState(null);

  return (
    <DimmerContext.Provider value={{ isVisible, setIsVisible, content, setContent }}>
      {children}
    </DimmerContext.Provider>
  );
}