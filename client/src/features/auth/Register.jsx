import { useState } from 'react';
import { useNavigate } from 'react-router-dom';;
import { useAuthStore } from "./auth.store";
import "@/styles/components/Auth.css";

export default function Register() {

    const navigate = useNavigate();
    const { register, loading, error } = useAuthStore();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' })

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await register(formData);
        if (success) navigate("/login", { state: { message: 'Реєстрація успішна! Тепер увійдіть.' } });
    };

    return (
        <div className="auth-container">
            <span>Реєстрація</span>
            <div className="input-container">
                <form onSubmit={handleSubmit} className="input-form">

                    {error && <div className="error-message">{error}</div>}

                    <input
                        name="username"
                        placeholder="Нікнейм"
                        onChange={(e) =>
                            setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <div className="auth-actions">
                        <button className="button-yellow" type="submit" disabled={loading}>
                            {loading ? 'Реєстрація...' : 'Створити акаунт'}
                        </button>

                        <p className="auth-switch">
                            Вже є акаунт?
                            <span onClick={() => navigate("/login")} style={{cursor: 'pointer', color: 'var(--color-main-orange)'}}>
                                {" "}Увійти
                            </span>
                        </p>
                    </div>

                </form>
            </div>
        </div>

    );
}