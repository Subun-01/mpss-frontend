"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface LowStockItem {
    _id: string;
    part_id: number;
    name: string;
    quantity: number;
    price: number;
    rack_position: string;
    vendor_email: string;
}

export default function ShowLowStockItems() {
    const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [reorderedItems, setReorderedItems] = useState<number[]>([]);

    useEffect(() => {
        const fetchLowStockItems = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inventory/low-stock`);
                setLowStockItems(response.data);
            } catch (error) {
                console.error("Error fetching low stock items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLowStockItems();
    }, []);

    const handleReorder = async (part_id: number) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inventory/reorder-email`, { part_id });
            alert(`Reorder email sent for part ID ${part_id}`);
            setReorderedItems(prev => [...prev, part_id]);
        } catch (error) {
            console.error("Failed to send reorder email:", error);
            alert("Failed to send reorder email.");
        }
    };

    const filteredLowStockItems = lowStockItems.filter((item) =>
        item.name?.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) {
        return <div className="text-center mt-10 text-white">Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white flex justify-center items-center">
            <div className="w-full max-w-6xl">
                <h2 className="text-3xl font-bold mb-6 text-blue-400 text-center">Low Stock Items</h2>

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
                                <th className="p-4 text-left">Vendor Email</th>
                                <th className="p-4 text-left">Actions</th>
                            
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLowStockItems.map((item) => (
                                <tr key={item._id} className="border-b hover:bg-gray-700">
                                    
                                    <td className="p-4">{item.part_id}</td>
                                    <td className="p-4">{item.name}</td>
                                    <td className="p-4">{item.quantity}</td>
                                    <td className="p-4">{item.vendor_email}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleReorder(item.part_id)}
                                            disabled={reorderedItems.includes(item.part_id)}
                                            className={`${
                                                reorderedItems.includes(item.part_id)
                                                  ? "bg-green-800 cursor-not-allowed"
                                                  : "bg-red-600 hover:bg-red-700"
                                              } text-white px-3 py-1 rounded-lg`}
                                        >
                                            {
                                                reorderedItems.includes(item.part_id)? "Ordered":"Reorder"
                                            }
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
