import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./auth.store";

export default function Login() {
    const navigate = useNavigate();

    const { login, loading, error } = useAuthStore();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await login(formData);
        console.log(success);
        if (success) navigate("/fanfics");
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
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })}
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