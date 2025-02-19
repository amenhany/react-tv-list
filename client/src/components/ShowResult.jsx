import '../../public/css/ShowResult.css'

export default function ShowResult({ show: result, preview, index }) {
    const year = result.show.premiered ? result.show.premiered.slice(0, 4) : "";
    const image = result.show.image ? result.show.image.medium : "../../public/imgs/no-img-portrait-text.png"

    function previewShow() {
        document.body.classList.add("stop-scroll");
        preview(index);
    }

    return (
        <div className="show-result" onClick={previewShow}>
            <img src={image} alt={result.show.name + " Image"} />
            <p>{result.show.name}{result.show.premiered && ` (${year})`}</p>
        </div>
    )
}