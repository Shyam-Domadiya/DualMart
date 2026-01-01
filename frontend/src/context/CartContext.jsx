import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, qty = 1) => {
        const exists = cart.find((i) => i.product.id === product.id);

        if (exists) {
            setCart(
                cart.map((i) =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + qty }
                        : i
                )
            );
        } else {
            setCart([...cart, { product, quantity: qty }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((i) => i.product.id !== id));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
