import { useEffect, useState } from "react";
import { getFanfics } from "./api";

export default function FanficList() {
    const [list, setList] = useState([]);

    useEffect(() => {
        getFanfics().then(res => setList(res.data));
    }, []);

    return (
        <div>
            {list.map(f => (
                <div key={f.id}>{f.title}</div>
            ))}
        </div>
    );
}
