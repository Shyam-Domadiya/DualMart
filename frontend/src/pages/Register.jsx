import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ username: "", password: "", email: "", role: "buyer" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("auth/register/", form);
            alert("Registration successful! Please login.");
            navigate("/");
        } catch (error) {
            alert("Registration failed.");
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-box">
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h1 className="heading-lg" style={{ color: "var(--primary-600)" }}>Join DualMart</h1>
                    <p className="text-muted">Create your account today.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <input
                            className="input-field"
                            placeholder="Choose a username"
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="name@example.com"
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Create a strong password"
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">I want to be a</label>
                        <select
                            className="input-field"
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                            <option value="buyer">Buyer (I want to purchase)</option>
                            <option value="supplier">Supplier (I want to sell)</option>
                        </select>
                    </div>

                    <button className="btn btn-primary" style={{ width: "100%" }}>
                        Create Account
                    </button>

                    <p className="text-muted" style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
                        Already have an account? <a href="/" style={{ color: "var(--primary-600)", fontWeight: "600" }}>Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
