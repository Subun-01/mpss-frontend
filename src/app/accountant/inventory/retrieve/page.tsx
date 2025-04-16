"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface InventoryPart {
  _id: string;
  part_id: number;
  name: string;
  quantity: number;
  price: number;
  rack_position: string;
  vendor_email: string;
}

export default function ShowData() {
  const [inventoryData, setInventoryData] = useState<InventoryPart[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inventory`);
        setInventoryData(response.data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const filteredInventory = inventoryData.filter((part) =>
    part.name?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex justify-center items-center">
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-6 text-blue-400 text-center">Motor Parts Inventory</h2>

        <input
          type="text"
          placeholder="Filter by part name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-3 mb-6 w-full rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-4 text-left">Part ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Price ($)</th>
                <th className="p-4 text-left">Rack Position</th>
                <th className="p-4 text-left">Vendor Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((part) => (
                <tr key={part._id} className="border-b hover:bg-gray-700">
                  <td className="p-4">{part.part_id}</td>
                  <td className="p-4">{part.name}</td>
                  <td className="p-4">{part.quantity}</td>
                  <td className="p-4">${part.price.toFixed(2)}</td>
                  <td className="p-4">{part.rack_position}</td>
                  <td className="p-4">{part.vendor_email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
