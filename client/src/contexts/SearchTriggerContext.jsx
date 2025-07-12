import { createContext, useState } from "react";

export const SearchTriggerContext = createContext({
  searchAttempt: 0,
  triggerSearch: () => {}
});

export default function SearchTriggerProvider({ children }) {
  const [searchAttempt, setSearchAttempt] = useState(0);

  const triggerSearch = () => setSearchAttempt(prev => prev + 1);

  return (
    <SearchTriggerContext.Provider value={{ searchAttempt, triggerSearch }}>
      {children}
    </SearchTriggerContext.Provider>
  );
}