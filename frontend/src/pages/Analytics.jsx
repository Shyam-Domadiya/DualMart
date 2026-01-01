import { useEffect, useState } from "react";
import API from "../services/api";

export default function Analytics() {
    const [data, setData] = useState(null);

    useEffect(() => {
        API.get("analytics/supplier/").then(res => setData(res.data));
    }, []);

    if (!data) return <p className="container">Loading analytics...</p>;

    return (
        <div className="container">
            <h2 className="heading-lg mb-6">Performance Analytics</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
                <div className="card" style={{ textAlign: "center" }}>
                    <p className="text-muted" style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Revenue</p>
                    <h3 className="heading-xl" style={{ color: "var(--primary-600)", margin: "0.5rem 0" }}>₹{data.total_revenue}</h3>
                    <span className="badge badge-success">+12% vs last month</span>
                </div>

                <div className="card" style={{ textAlign: "center" }}>
                    <p className="text-muted" style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Orders</p>
                    <h3 className="heading-xl" style={{ margin: "0.5rem 0" }}>{data.total_orders}</h3>
                    <span className="text-muted" style={{ fontSize: "0.85rem" }}>Avg. 2 per day</span>
                </div>
            </div>

            <h3 className="heading-lg mb-4">Best Selling Products</h3>
            <div className="card" style={{ overflow: "hidden" }}>
                {data.best_selling_products && data.best_selling_products.length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "var(--surface-50)", textAlign: "left" }}>
                                <th style={{ padding: "1rem" }}>Product</th>
                                <th style={{ padding: "1rem" }}>Units Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.best_selling_products.map((p, idx) => (
                                <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                                    <td style={{ padding: "1rem", fontWeight: "500" }}>{p.product__name}</td>
                                    <td style={{ padding: "1rem" }}>{p.total_sold} units</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-muted">No sales data available yet.</p>
                )}
            </div>
        </div>
    );
}
