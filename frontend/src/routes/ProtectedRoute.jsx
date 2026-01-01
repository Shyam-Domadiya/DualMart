import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <p>Loading...</p>;
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/" />;
    }

    // Role mismatch
    if (role && user.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
}
