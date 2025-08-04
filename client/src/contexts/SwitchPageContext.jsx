import { createContext, useState, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";


export const SwitchPageContext = createContext({
    isSwitchPage: false,
    setIsSwitchPage: () => {}
});


export default function SwitchPageProvider({ children }) {
    const [isSwitchPage, setIsSwitchPage] = useState(false);
    const { checkSession } = useAuth();
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        checkSession();
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);


    return (
        <SwitchPageContext.Provider value={{ isSwitchPage, setIsSwitchPage }}>
            {children}
        </SwitchPageContext.Provider>
    )
}