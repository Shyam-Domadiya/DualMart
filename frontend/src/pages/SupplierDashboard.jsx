import Analytics from "./Analytics";

export default function SupplierDashboard() {
    return (
        <main className="container">
            <div className="mb-6">
                <h2 className="heading-lg">Supplier Overview</h2>
                <p className="text-muted">Manage your store performance and inventory.</p>
            </div>
            <Analytics />
        </main>
    );
}
