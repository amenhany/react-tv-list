import '../css/Error.css'


export default function Error({ text, statusCode = -1 }) {
    return (
        <div className="position-absolute top-50 start-50 translate-middle text-center selectDisable error-container">
            {statusCode !== -1 && <h1 className="title h1">Error {statusCode}</h1>}
            <img src="/imgs/tree_trunks.svg" alt="Tree Trunks SVG" width="350" />
            <p className="error-text">{text}</p>
        </div>
    )
}