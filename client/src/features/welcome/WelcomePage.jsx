import { useNavigate } from "react-router-dom";
import "@/styles/components/WelcomePage.css";

export const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <section className="welcome-elem welcome-logo">
                D<span>rafts</span>
            </section>

            <section className="welcome-elem welcome-goal">
                <div className="goal-content">
                    <span>Ціль</span>
                    <p>Drafts - це простір для твоїх ідей...</p>
                </div>
                <div className="goal-dorian">
                    <span>Dorian</span>
                </div>
            </section>

            <section className="welcome-elem welcome-register">
                <div className="register-content">
                    <div className="register-title">
                        <span>Почни свою подорож зараз...</span>
                    </div>
                    <div className="register-imgs">
                        <img src={"http://localhost:5000/uploads/images/test.avif"} alt="pic"/>
                        <img src={"http://localhost:5000/uploads/images/test.avif"} alt="pic"/>
                        <img src={"http://localhost:5000/uploads/images/test.avif"} alt="pic"/>
                        <img src={"http://localhost:5000/uploads/images/test.avif"} alt="pic"/>
                    </div>
                </div>
                <button className="button-green" onClick={() => navigate("login")}>Увійти</button>
            </section>
        </div>
    );
}

export default WelcomePage;