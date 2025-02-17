import '../../public/css/ShowResult.css'

export default function ShowResult({ show: result }) {
    const year = result.show.premiered.slice(0, 4);

    return (
        <div className="show-result">
            <img src={result.show.image.medium} alt={result.show.name + " Image"} />
            <p>{`${result.show.name} (${year})`}</p>
        </div>
    )
}