import '../css/Card.css'

export default function Card({ title, children, header, footer }) {
    return (
        <div className="container">
            <div className="row justify-content-center">
                    <div className="d-flex justify-content-center">
                    <div className="card popup-card">
                        {header ? 
                        <div className="card-header">
                            { header }
                        </div>
                        : title &&
                        <div className="card-header pt-3 pb-2 ps-3">
                            <h5>{ title }</h5>
                        </div>
                        }
                        <div className="card-body">
                            { children }
                        </div>
                        { footer &&
                        <div className="card-footer">
                            { footer }
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}