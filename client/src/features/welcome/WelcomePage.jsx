import { useNavigate } from "react-router-dom";
import "@/styles/components/WelcomePage.css";
import {useAuthStore} from "@/features/auth/auth.store";
import Footer from "@/shared/ui/Footer";

export const WelcomePage = () => {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const isLoggedIn = !!user;

    const handleWrite = () => {
        if(isLoggedIn){
            navigate("/fanfics/new");
        }
        else {
            navigate("login");
        }
    }

    return (
        <div className="welcome-container">
            <section className="welcome-elem welcome-logo">
                D<span>rafts</span>
            </section>

            <section className="welcome-elem welcome-goal">
                <div className="goal-content">
                    <span>Ціль</span>
                    <p>
                        Drafts - це простір для твоїх ідей, що давно чекають на реалізацію.
                        Тут ти знайдеш натхнення, нові емоції та й цікавий фанфік на вечір.
                    </p>
                </div>
                <div className="goal-dorian">
                    <img src={"http://localhost:5000/uploads/images/dorian/Fox2.png"} alt="Dorian"/>
                </div>
            </section>

            <section className="welcome-elem welcome-register">
                <div className="register-content">
                    <div className="register-title">
                        <span>Почни свою подорож зараз...</span>
                    </div>
                    <div className="register-imgs">
                        <img src={"http://localhost:5000/uploads/covers/cover-hp.jpg"} alt="pic"/>
                        <img src={"http://localhost:5000/uploads/covers/cover-naruto.jpg"} alt="pic"/>
                        <img src={"http://localhost:5000/uploads/covers/cover-atla.jpg"} alt="pic"/>
                        <img src={"http://localhost:5000/uploads/covers/cover-romance.jpg"} alt="pic"/>
                    </div>
                </div>
                <button className="button-green" onClick={() => navigate("login")}>Увійти</button>
            </section>


            <section className="welcome-elem welcome-goal welcome-dorian-section">

                <div className="goal-content">
                    <span>...або <span className="dorian-span">Доріан</span> допоможе тобі...</span>
                    <p>
                        Доріан знайомий із усіма постійними відвідувачами Drafts, тому без проблем знайде потрібні саме тобі твори!
                        Для нових читачів лис-бібліотекар залюбки запропонує найпопулярніші наразі роботи. Скоріше долучайся!
                    </p>
                    <button
                        className="button-orange"
                        onClick={() => navigate("recommendations")}
                    >
                        До бібліотеки
                    </button>
                </div>

                <div className="goal-dorian">
                    <img src="http://localhost:5000/uploads/images/dorian/Fox3.png" alt="Dorian"/>
                </div>
            </section>

            <section className="welcome-elem welcome-goal welcome-dorian-section">

                <div className="goal-dorian">
                    <img src="http://localhost:5000/uploads/images/dorian/Fox1.png" alt="Dorian"/>
                </div>

                <div className="goal-content">
                    <span>...або <span className="write-span">пиши</span>!</span>
                    <p>
                        Чи знаєш ти, що "Джейн Ейр" та навіть "Ромео та Джульєтту" можна вважати фанатськими роботами?

                        Кожен видатний письменник починав із простого захоплення, тож досить мріяти - час діяти!
                        Ти можеш почати писати тут і зараз, тільки спочатку зареєструйся ;)
                    </p>
                    <button
                        className="button-yellow"
                        onClick={handleWrite}
                    >
                        Писати
                    </button>
                </div>
            </section>

            <Footer/>
        </div>
    );
}

export default WelcomePage;