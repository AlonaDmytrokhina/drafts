import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api"; // Шлях до вашого сервісу

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await loginUser(formData);

            // Зберігаємо токен (accessToken), який прийшов з бекенду
            localStorage.setItem("token", data.accessToken);

            // Переходимо на сторінку з фанфіками
            navigate("/fanfics");
        } catch (err) {
            // Обробка помилки (беремо повідомлення з відповіді сервера)
            setError(err.response?.data?.message || "Невірний логін або пароль");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <span>Вхід</span>
            <div className="input-container">
                <form className="input-form" onSubmit={handleSubmit}>

                    {error && <p className="error-text" style={{color: 'red'}}>{error}</p>}

                    <input
                        type="email"
                        name="email"
                        placeholder="Електронна пошта"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="auth-actions">
                        <button className="button-yellow" type="submit" disabled={loading}>
                            {loading ? "Вхід..." : "Увійти"}
                        </button>

                        <p className="auth-switch">
                            Немає акаунту?
                            <span onClick={() => navigate("/register")} style={{cursor: 'pointer', color: 'var(--color-main-orange)'}}>
                                {" "}Зареєструватися
                            </span>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
}