import { useEffect, useState } from "react";
import API from "../services/api";

export default function SupplierOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        API.get("orders/supplier/").then((res) => setOrders(res.data));
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await API.patch(`orders/${orderId}/status/`, { status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending": return "badge-warning";
            case "shipped": return "badge-brand";
            case "delivered": return "badge-success";
            case "cancelled": return "badge-danger";
            default: return "badge-warning";
        }
    };

    return (
        <div className="container">
            <h2 className="heading-lg mb-6">Manage Orders</h2>

            <div className="flex-col gap-4">
                {orders.map((order) => (
                    <div key={order.id} className="card">
                        <div className="flex-between mb-4" style={{ borderBottom: "1px solid var(--surface-200)", paddingBottom: "1rem" }}>
                            <div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>Order #{order.id}</h3>
                                <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>
                                    Buyer: {order.buyer_username}
                                </p>
                                <p className="text-muted" style={{ fontSize: "0.85rem" }}>{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex-center gap-4">
                                <span className={`badge ${order.payment_method === 'COD' ? 'badge-brand' : 'badge-success'}`} style={{ marginRight: "10px" }}>
                                    {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Paid Online (UPI)'}
                                </span>
                                <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className="input-field"
                                    style={{ width: "auto", padding: "0.3rem", fontSize: "0.9rem" }}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ background: "var(--surface-50)", borderRadius: "8px", padding: "1rem" }}>
                            {order.items.map((item) => (
                                <div key={item.id} className="flex-between" style={{ marginBottom: "0.5rem" }}>
                                    <span>{item.product_name} <span className="text-muted">x{item.quantity}</span></span>
                                    <span style={{ fontWeight: "600" }}>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                        No orders yet.
                    </div>
                )}
            </div>
        </div>
    );
}
