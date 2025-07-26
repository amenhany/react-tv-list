import { useEffect } from "react";
import Error from "../components/Error"


export default function Home() {
    useEffect(() => { document.title =  `TV List`; }, []);

    return (
        <Error text="Nothing here..." />
    )
}