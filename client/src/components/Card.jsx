export default function Card({ title, children }) {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-10">
                    <div className="d-flex justify-content-center">
                    <div className="card popup-card">
                        <h5 className="card-header pt-3 pb-3">{ title }</h5>
                        <div className="card-body">
                            { children }
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}