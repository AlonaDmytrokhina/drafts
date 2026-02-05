import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './api';
import "@/styles/components/Auth.css";

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await registerUser(formData);
            navigate('/login', { state: { message: 'Реєстрація успішна! Тепер увійдіть.' } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        onChange={handleChange}
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