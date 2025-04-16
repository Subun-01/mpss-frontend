
import Link from 'next/link';
import ProtectedRoute from '../ProtectedRoute';


export default function ShopOwner() {
    return (
        <ProtectedRoute>

        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-green-700 mb-4">Shop Owner Dashboard</h2>
            <ul className="space-y-3">

                <li>
                    <Link href="/shop-owner/revenue-report" className="block px-4 py-2 bg-green-100 rounded-md text-green-700 hover:bg-green-200 transition">
                        📊 Revenue Report
                    </Link>
                </li>
                <li>
                    <Link href="/shop-owner/vendor-management" className="block px-4 py-2 bg-green-100 rounded-md text-green-700 hover:bg-green-200 transition">
                        ⚙️ Vendor Management
                    </Link>
                </li>
            </ul>
        </div>
        </ProtectedRoute>
    );
}
