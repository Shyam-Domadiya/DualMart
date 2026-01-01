import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                navigate(`/products?search=${searchTerm}`);
            } else if (searchTerm === "") {
                // Optional: navigate to products without search? 
                // navigate('/products'); 
                // Let's keep it simple: if empty they stay, or we can clear filter. 
                // For now, let's only navigate if there is length, or if they explicitly cleared it while on products page.
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, navigate]);

    if (!user) return null;

    return (
        <header className="nav-header">
            <div className="container flex-between" style={{ padding: "0.5rem 2rem" }}>
                <h1 className="heading-lg" style={{ fontSize: "1.5rem", color: "var(--primary-600)" }}>
                    DualMart
                    {user.role === 'supplier' && (
                        <span className="badge badge-warning" style={{ fontSize: "0.7rem", verticalAlign: "middle", marginLeft: "0.5rem" }}>Supplier</span>
                    )}
                </h1>

                <nav className="flex-center gap-4">
                    {user.role === 'buyer' && (
                        <>
                            <div className="input-group" style={{ marginBottom: 0, marginRight: "1rem" }}>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="input-field"
                                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.9rem", width: "200px" }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Link to="/buyer" className="nav-link">Home</Link>
                            <Link to="/products" className="nav-link">Products</Link>
                            <Link to="/cart" className="nav-link">Cart</Link>
                            <Link to="/orders" className="nav-link">Orders</Link>
                        </>
                    )}

                    {user.role === 'supplier' && (
                        <>
                            <Link to="/supplier" className="nav-link">Dashboard</Link>
                            <Link to="/supplier/products" className="nav-link">My Products</Link>
                            <Link to="/supplier/orders" className="nav-link">Manage Orders</Link>
                            <Link to="/analytics" className="nav-link">Analytics</Link>
                        </>
                    )}
                </nav>

                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                    Logout
                </button>
            </div>
        </header>
    );
}
