import Link from 'next/link';
import ProtectedRoute from '../ProtectedRoute';

export default function Accountant() {
    return (
        <ProtectedRoute>

        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Accountant Dashboard</h2>
            <ul className="space-y-3">
                <li>
                    <Link href="/accountant/sales" className="block px-4 py-2 bg-blue-100 rounded-md text-blue-700 hover:bg-blue-200 transition">
                        🧾 Sales & Billing 
                    </Link>
                </li>
                <li>
                    <Link href="/accountant/inventory" className="block px-4 py-2 bg-blue-100 rounded-md text-blue-700 hover:bg-blue-200 transition">
                        🛠️ Inventory Management
                    </Link>
                </li>
            </ul>
        </div>
        </ProtectedRoute>
    );
}
