import CloseButton from "./CloseButton";
import "../../public/css/Dimmer.css";
import { useEffect } from "react";


export default function Dimmer({ close, children }) {

    function closeDimmer() {
        close();
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            const keyName = event.key;
            if (keyName === 'Escape') {
                closeDimmer();
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <div className="dimmer">
            <CloseButton closeDimmer={closeDimmer} />
            { children }
        </div>
    )
}