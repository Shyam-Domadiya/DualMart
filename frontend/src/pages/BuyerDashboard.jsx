import Products from "./Products";

export default function BuyerDashboard() {
    return (
        <main className="container">
            <div className="mb-6 flex-between">
                <h2 className="heading-lg">Buyer Dashboard</h2>
            </div>
            <Products />
        </main>
    );
}
