import { useParams } from "react-router-dom";

export default function FanficPage() {
    const { id } = useParams();

    return (
        <div>
            <h1>Фанфік {id}</h1>
        </div>
    );
}
