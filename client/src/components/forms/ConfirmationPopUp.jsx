import { useDimmerContext } from "../../contexts/DimmerContext";
import Card from "../Card";


export default function ConfirmationPopUp({ message, buttonText, buttonColor, fn }) {
    const { setIsVisible } = useDimmerContext();

    function handleCancel() {
        setIsVisible(false);
    }

    return (
        <Card title="Confirmation">
            <p className="card-text py-1 me-1">{message}</p>
            <button onClick={fn} className={`btn btn-${buttonColor} me-2`}>{buttonText}</button>
            <button onClick={handleCancel} className="btn btn-outline-secondary">Cancel</button>
        </Card>
    )
}