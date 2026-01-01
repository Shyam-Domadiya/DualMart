import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [isPaid, setIsPaid] = useState(false);
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("UPI"); // UPI or COD

    useEffect(() => {
        const t = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        setTotal(t.toFixed(2));
    }, [cart]);

    const handlePlaceOrder = async () => {
        if (paymentMethod === "UPI" && !isPaid) {
            alert("Please confirm that you have completed the payment.");
            return;
        }

        const items = cart.map((i) => ({
            product: i.product.id,
            quantity: i.quantity,
        }));

        try {
            await API.post("orders/buyer/", {
                items,
                payment_method: paymentMethod
            });
            alert("Order placed successfully!");
            clearCart();
            navigate("/buyer");
        } catch (err) {
            console.error("Order failed", err);
            alert("Failed to place order. Please try again.");
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container text-center">
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate("/products")} className="btn btn-primary mt-4">Go Shopping</button>
            </div>
        );
    }

    const upiId = "7859924844@fam";
    const params = new URLSearchParams({
        pa: upiId,
        pn: "DualMart",
        am: total,
        cu: "INR",
        tn: "Order Payment"
    }).toString();
    const upiLink = `upi://pay?${params}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h2 className="heading-lg mb-6">Checkout</h2>

            <div className="card">
                <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem" }}>Order Summary</h3>
                <div style={{ marginBottom: "1.5rem" }}>
                    {cart.map(item => (
                        <div key={item.product.id} className="flex-between" style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                            <span>{item.product.name} (x{item.quantity})</span>
                            <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: "1px solid var(--border-light)", marginTop: "1rem", paddingTop: "1rem" }} className="flex-between">
                        <strong>Total Amount</strong>
                        <strong style={{ fontSize: "1.2rem" }}>₹{total}</strong>
                    </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem" }}>Payment Method</h3>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                            className={`btn ${paymentMethod === "UPI" ? 'btn-primary' : 'btn-outline'}`}
                            style={{ flex: 1 }}
                            onClick={() => setPaymentMethod("UPI")}
                        >
                            UPI / QR Code
                        </button>
                        <button
                            className={`btn ${paymentMethod === "COD" ? 'btn-primary' : 'btn-outline'}`}
                            style={{ flex: 1 }}
                            onClick={() => setPaymentMethod("COD")}
                        >
                            Cash on Delivery
                        </button>
                    </div>
                </div>

                {paymentMethod === "UPI" ? (
                    <>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem" }}>Scan & Pay</h3>

                        <div style={{ textAlign: "center", background: "var(--surface-50)", padding: "2rem", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid var(--border-light)" }}>
                            <div style={{ background: "#fff", padding: "10px", borderRadius: "8px", display: "inline-block", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                <img
                                    src={qrUrl}
                                    alt="UPI QR Code"
                                    style={{ width: "200px", height: "auto", mixBlendMode: "multiply", display: "block" }}
                                />
                            </div>

                            <div style={{ marginTop: "1.5rem" }}>
                                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>UPI ID</p>
                                <p style={{ fontWeight: "700", fontSize: "1.1rem", cursor: "pointer" }} onClick={() => { navigator.clipboard.writeText(upiId); alert("UPI ID copied!"); }} title="Click to copy">
                                    {upiId} <span style={{ fontSize: "0.8rem", color: "var(--primary-color)", fontWeight: "400" }}>(Copy)</span>
                                </p>
                            </div>

                            <a href={upiLink} className="btn btn-outline mt-4" style={{ display: "inline-block", width: "100%", maxWidth: "250px" }}>
                                Pay via UPI App
                            </a>
                        </div>

                        <div className="input-group flex-center" style={{ gap: "10px", justifyContent: "flex-start", marginBottom: "1.5rem" }}>
                            <input
                                type="checkbox"
                                id="paid-check"
                                checked={isPaid}
                                onChange={(e) => setIsPaid(e.target.checked)}
                                style={{ width: "20px", height: "20px", cursor: "pointer" }}
                            />
                            <label htmlFor="paid-check" style={{ cursor: "pointer", userSelect: "none" }}>
                                I have completed the payment of <strong>₹{total}</strong>
                            </label>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: "center", padding: "2rem", background: "var(--surface-50)", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid var(--border-light)" }}>
                        <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>📦 Pay on Delivery</p>
                        <p className="text-muted">You can pay via Cash or UPI when the order arrives.</p>
                    </div>
                )}

                <button
                    onClick={handlePlaceOrder}
                    className={`btn btn-primary`}
                    style={{ width: "100%" }}
                    disabled={paymentMethod === "UPI" && !isPaid}
                >
                    {paymentMethod === "UPI" ? "Confirm Payment & Order" : "Place Order (COD)"}
                </button>
            </div>
        </div>
    );
}
