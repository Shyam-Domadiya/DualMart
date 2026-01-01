import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(form);
        navigate(user?.role === "supplier" ? "/supplier" : "/buyer");
    };

    return (
        <div className="auth-container">
            <div className="card auth-box">
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h1 className="heading-lg" style={{ color: "var(--primary-600)" }}>DualMart</h1>
                    <p className="text-muted">Welcome back, please login.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <input
                            className="input-field"
                            placeholder="Enter your username"
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Enter your password"
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>

                    <button className="btn btn-primary" style={{ width: "100%" }}>
                        Login to Account
                    </button>

                    <p className="text-muted" style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
                        New here? <a href="/register" style={{ color: "var(--primary-600)", fontWeight: "600" }}>Create an account</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
