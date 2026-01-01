import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function SupplierProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        API.get("products/?supplier=me").then((res) => {
            // Handle paginated or non-paginated response
            const data = Array.isArray(res.data) ? res.data : res.data.results;
            setProducts(data);
        });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await API.delete(`products/${id}/`);
                setProducts(products.filter((p) => p.id !== id));
            } catch (err) {
                alert("Failed to delete product.");
            }
        }
    };

    return (
        <div className="container">
            <div className="flex-between mb-6">
                <h2 className="heading-lg">My Products</h2>
                <Link to="/supplier/products/add" className="btn btn-primary">Add Product</Link>
            </div>

            <div className="card">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--surface-200)" }}>
                            <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
                            <th style={{ padding: "1rem", textAlign: "left" }}>Price</th>
                            <th style={{ padding: "1rem", textAlign: "left" }}>Stock</th>
                            <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} style={{ borderBottom: "1px solid var(--surface-100)" }}>
                                <td style={{ padding: "1rem" }}>{p.name}</td>
                                <td style={{ padding: "1rem" }}>₹{p.price}</td>
                                <td style={{ padding: "1rem" }}>{p.stock}</td>
                                <td style={{ padding: "1rem", textAlign: "right" }}>
                                    <Link
                                        to={`/supplier/products/edit/${p.id}`}
                                        className="btn btn-outline"
                                        style={{ marginRight: "0.5rem", padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="btn btn-danger"
                                        style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                        No products found. Start by adding one!
                    </div>
                )}
            </div>
        </div>
    );
}
