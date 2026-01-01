import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductForm() {
    const { id } = useParams(); // If ID exists, we are editing
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });

    useEffect(() => {
        if (isEdit) {
            API.get(`products/${id}/`).then((res) => {
                setForm({
                    name: res.data.name,
                    description: res.data.description,
                    price: res.data.price,
                    stock: res.data.stock,
                });
            });
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await API.put(`products/${id}/`, form);
            } else {
                await API.post("products/", form);
            }
            navigate("/supplier/products");
        } catch (err) {
            alert("Failed to save product.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <div className="card" style={{ padding: "2rem" }}>
                <h2 className="heading-lg mb-6">{isEdit ? "Edit Product" : "Add New Product"}</h2>

                <form onSubmit={handleSubmit} className="flex-col gap-4">
                    <div className="input-group">
                        <label className="input-label">Product Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            rows="3"
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    <div className="flex-between gap-4">
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-4">
                        {isEdit ? "Update Product" : "Create Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}
