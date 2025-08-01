import { useEffect } from 'react'
import '../css/Error.css'


export default function Error({ text, statusCode = -1 }) {
    
    useEffect(() => {
        if (statusCode !== -1) console.error(statusCode);
    }, [])

    return (
        <div className="text-center selectDisable error-container">
            {statusCode !== -1 && <h1 className="title h1">Error {statusCode}</h1>}
            <img src="/imgs/tree_trunks.svg" alt="Tree Trunks SVG" width="350" />
            <p className="error-text">{text}</p>
        </div>
    )
}