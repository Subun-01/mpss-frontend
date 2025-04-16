import Link from 'next/link';

export default function InventoryManagement() {
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Inventory Management</h2>
      <div className="grid gap-4">
        <Link legacyBehavior href="/accountant/inventory/add">
          <a className="block px-4 py-2 bg-green-100 rounded-md text-green-700 hover:bg-green-200 transition">
            ➕ Add Motor Parts
          </a>
        </Link>
        <Link legacyBehavior href="/accountant/inventory/delete">
          <a className="block px-4 py-2 bg-red-100 rounded-md text-red-700 hover:bg-red-200 transition">
            ❌ Delete Motor Parts
          </a>
        </Link>
        <Link legacyBehavior href="/accountant/inventory/retrieve">
          <a className="block px-4 py-2 bg-blue-100 rounded-md text-blue-700 hover:bg-blue-200 transition">
            🔍 Retrieve Motor Parts
          </a>
        </Link>
        <Link legacyBehavior href="/accountant/inventory/lowStockItem">
          <a className="block px-4 py-2 bg-blue-100 rounded-md text-blue-700 hover:bg-blue-200 transition">
            Low Stock Motor Parts
          </a>
        </Link>
      </div>
    </div>
  );
}
