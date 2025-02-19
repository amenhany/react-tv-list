import "../../public/css/ShowPreview.css";


export default function ShowPreview({ selected }) {
    const image = selected.show.image ? selected.show.image.medium : "../../public/imgs/no-img-portrait-text.png"

    let info = `Rating: ${selected.show.rating.average || '-'}/10, Language: ${selected.show.language}`;
    if (selected.show.premiered) {
        const dateArr = selected.show.premiered.split('-');
        const date = `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
        info += `, Premiered: ${date}`;
    }

    return (
        <div className="container show-preview">
            <div className="row align-items-center">
                <img src={image} alt="" className="col-6 col-lg-4 show-preview-img" />
                <div className="col-6 col-lg-8">
                    <h1 className="show-preview-title">{ selected.show.name }</h1>
                    <h2 className="show-preview-genre">
                        { selected.show.genres.join(", ") }
                    </h2>
                    <h3 className="show-preview-info">
                        { info }
                    </h3>
                    <div className="show-preview-description" dangerouslySetInnerHTML={
                        { __html: selected.show.summary }
                    }></div>
                    <h3 className="show-preview-runtime">
                        { `Average Runtime: ${selected.show.averageRuntime ? selected.show.averageRuntime
                            + ' minutes' : 'Unknown'}, Status: ${selected.show.status}` }
                    </h3>
                    <div className="row">
                        <div className="col-2">
                        <label htmlFor="rating">Rating: </label>
                        <select id="rating" name="show[rating]" className="form-select">
                            <option selected disabled value="">Rating...</option>
                            <option value="10">10</option>
                            <option value="9">9</option>
                            <option value="8">8</option>
                            <option value="7">7</option>
                            <option value="6">6</option>
                            <option value="5">5</option>
                            <option value="4">4</option>
                            <option value="3">3</option>
                            <option value="2">2</option>
                            <option value="1">1</option>
                        </select>
                        </div>
                        <div className="col">
                        <button className="btn btn-success py-2 px-3 mt-3 list-button">Add to List</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}