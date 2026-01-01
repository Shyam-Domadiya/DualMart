import { useEffect, useState } from "react";
import API from "../services/api";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("orders/buyer/")
            .then((res) => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch orders", err);
                setLoading(false);
            });
    }, []);

    const getBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'badge-warning';
            case 'shipped': return 'badge-brand';
            case 'delivered': return 'badge-success';
            case 'cancelled': return 'badge-danger';
            default: return 'badge-warning';
        }
    };

    if (loading) return <div className="container"><p>Loading orders...</p></div>;

    return (
        <div className="container">
            <h2 className="heading-lg mb-6">Order History</h2>

            {orders.length === 0 ? (
                <div className="card text-muted" style={{ textAlign: "center", padding: "3rem" }}>
                    <p>No past orders found.</p>
                </div>
            ) : (
                <div className="flex-col gap-4">
                    {orders.map((order) => {
                        const orderTotal = order.items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

                        return (
                            <div key={order.id} className="card">
                                <div className="flex-between mb-4" style={{ alignItems: "flex-start" }}>
                                    <div>
                                        <h4 style={{ fontWeight: "700", marginBottom: "0.25rem" }}>Order #{order.id}</h4>
                                        <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                                            Placed on: {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className={`badge ${getBadgeClass(order.status)}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>

                                <div style={{ background: "var(--surface-50)", padding: "1rem", borderRadius: "8px" }}>
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex-between" style={{ marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                                            <div>
                                                <span style={{ fontWeight: "500" }}>{item.product_name}</span>
                                                <span className="text-muted ml-2">x{item.quantity}</span>
                                            </div>
                                            <span style={{ fontWeight: "600" }}>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div style={{ borderTop: "1px solid var(--border-light)", marginTop: "0.75rem", paddingTop: "0.75rem", textAlign: "right" }}>
                                        <span style={{ marginRight: "1rem" }} className="text-muted">Total Amount:</span>
                                        <strong style={{ fontSize: "1.2rem" }}>₹{orderTotal.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
