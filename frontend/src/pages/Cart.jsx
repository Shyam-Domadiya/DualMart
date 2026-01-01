import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const proceedToCheckout = () => {
        navigate("/checkout");
    };

    return (
        <div className="container">
            <h2 className="heading-lg mb-6">Your Shopping Cart</h2>

            {cart.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                    <p className="text-muted">Your cart is empty.</p>
                    <a href="/products" className="btn btn-primary mt-4">Start Shopping</a>
                </div>
            ) : (
                <div className="card">
                    {cart.map((i) => (
                        <div key={i.product.id} className="flex-between" style={{ padding: "1rem 0", borderBottom: "1px solid var(--border-light)" }}>
                            <div>
                                <h4 style={{ fontWeight: "600" }}>{i.product.name}</h4>
                                <span className="text-muted">Quantity: {i.quantity}</span>
                            </div>
                            <div className="flex-center gap-4">
                                <span style={{ fontWeight: "600" }}>₹{i.product.price * i.quantity}</span>
                                <button onClick={() => removeFromCart(i.product.id)} className="btn btn-outline" style={{ color: "var(--accent-danger)", borderColor: "var(--accent-danger)" }}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex-between" style={{ marginTop: "2rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                            Total: ₹{cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}
                        </h3>
                        <button onClick={proceedToCheckout} className="btn btn-primary">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
