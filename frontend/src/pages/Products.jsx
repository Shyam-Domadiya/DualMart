import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import { CartContext } from "../context/CartContext";

/* ---------------- ProductCard (Unchanged Logic) ---------------- */
const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const [status, setStatus] = useState("idle");
    const [qty, setQty] = useState(1);

    const handleConfirm = () => {
        addToCart(product, parseInt(qty, 10));
        setStatus("added");
        setTimeout(() => {
            setStatus("idle");
            setQty(1);
        }, 1500);
    };

    return (
        <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{
                height: "180px",
                background: "linear-gradient(135deg, var(--surface-100), var(--surface-200))",
                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)"
            }}>
                <span style={{ fontSize: "3rem" }}>📦</span>
            </div>
            <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: "auto" }}>
                    <div className="flex-between" style={{ marginBottom: "0.5rem" }}>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{product.name}</h4>
                        <span style={{ fontWeight: 600 }}>₹{product.price}</span>
                    </div>
                    <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                        {product.description || "High quality product from verified supplier."}
                    </p>
                </div>
                <div style={{ marginTop: "1rem" }}>
                    {status === "idle" && (
                        <button className="btn btn-primary" onClick={() => setStatus("selecting")} style={{ width: "100%" }}>
                            Add to Cart
                        </button>
                    )}
                    {status === "selecting" && (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)}
                                className="input-field" style={{ width: "80px", textAlign: "center" }} />
                            <button className="btn btn-primary" onClick={handleConfirm} style={{ flex: 1 }}>
                                Confirm
                            </button>
                        </div>
                    )}
                    {status === "added" && (
                        <button className="btn btn-success" disabled style={{ width: "100%" }}>✓ Added</button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ---------------- Products Page ---------------- */
export default function Products() {
    const { addToCart } = useContext(CartContext);
    const [searchParams] = useSearchParams(); // Read URL params if needed

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters State
    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        category: "",
        min_price: "",
        max_price: ""
    });

    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    // Debounce Search Logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 500);
        return () => clearTimeout(handler);
    }, [filters.search]);

    // Fetch Logic
    const fetchProducts = async (currentPage, shouldReset) => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                search: debouncedSearch || undefined,
                category: filters.category || undefined,
                min_price: filters.min_price || undefined,
                max_price: filters.max_price || undefined,
            };

            const res = await API.get("products/", { params });

            // Assuming pagination in future, but if backend returns list:
            const newProducts = Array.isArray(res.data) ? res.data : res.data.results;
            const isNext = res.data.next ? true : false; // If DRF pagination is on

            if (shouldReset) {
                setProducts(newProducts || []);
            } else {
                setProducts(prev => [...prev, ...(newProducts || [])]);
            }

            // Logic for hasMore (fallback if no pagination metadata)
            if (!newProducts || newProducts.length === 0) setHasMore(false);
            else setHasMore(true); // Ideally check res.data.next

        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    // Trigger Fetch when Filters Change (Reset Page)
    useEffect(() => {
        setPage(1);
        fetchProducts(1, true);
    }, [debouncedSearch, filters.category, filters.min_price, filters.max_price]);

    // Load More Handler
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, false);
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="container">
            <div className="mb-6">
                <h2 className="heading-lg">Products</h2>
            </div>

            {/* Filters Bar */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <input
                    name="search"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={handleChange}
                    className="input-field"
                    style={{ maxWidth: "200px" }}
                />
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="input-field"
                    style={{ maxWidth: "150px" }}
                >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                </select>
                <input
                    name="min_price"
                    type="number"
                    placeholder="Min Price"
                    value={filters.min_price}
                    onChange={handleChange}
                    className="input-field"
                    style={{ maxWidth: "100px" }}
                />
                <input
                    name="max_price"
                    type="number"
                    placeholder="Max Price"
                    value={filters.max_price}
                    onChange={handleChange}
                    className="input-field"
                    style={{ maxWidth: "100px" }}
                />
            </div>

            {/* Grid */}
            <div className="grid-products">
                {products.map((p) => (
                    <ProductCard key={`${p.id}-${p.name}`} product={p} />
                ))}
            </div>

            {/* Load More */}
            {hasMore && products.length > 0 && (
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                    <button onClick={handleLoadMore} disabled={loading} className="btn btn-secondary">
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}

            {!loading && products.length === 0 && (
                <p className="text-muted text-center mt-4">No products found.</p>
            )}
        </div>
    );
}
