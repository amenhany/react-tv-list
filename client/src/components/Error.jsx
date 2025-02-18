import '../../public/css/Error.css'


export default function Error({ text }) {
    return (
        <div className="position-absolute top-50 start-50 translate-middle text-center selectDisable">
            <img src="../../public/imgs/tree_trunks.svg" alt="Tree Trunks SVG" width="350" />
            <p className="error-text">{text}</p>
        </div>
    )
}