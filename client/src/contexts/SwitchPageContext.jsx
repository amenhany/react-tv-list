import { createContext, useState } from "react";


export const SwitchPageContext = createContext({
    isSwitchPage: false,
    setIsSwitchPage: () => {}
});


export default function SwitchPageProvider({ children }) {
    const [isSwitchPage, setIsSwitchPage] = useState(false);

    return (
        <SwitchPageContext.Provider value={{ isSwitchPage, setIsSwitchPage }}>
            {children}
        </SwitchPageContext.Provider>
    )
}