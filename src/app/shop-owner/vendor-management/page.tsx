"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function VendorManagement() {
    const [vendors, setVendors] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendors`);
                setVendors(response.data); // Assuming response.data is an array of vendors
            } catch (error) {
                console.error("Error fetching vendors:", error);
            }
        };

        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter((vendor: any) =>
        vendor.part.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white flex justify-center items-center">
            <div className="w-full max-w-5xl">
                <h2 className="text-3xl font-bold mb-6 text-green-400 text-center">Vendor Management</h2>
                <input
                    type="text"
                    placeholder="Filter by motor part"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border p-3 mb-6 w-full rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-lg">
                        <thead>
                            <tr className="bg-green-500 text-white">
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Part</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Phone</th>
                                <th className="p-4 text-left">Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVendors.map((vendor: { name?: string; part?: string; email?: string; phone?: string; address?: string }, index: number) => (
                                <tr key={index} className="border-b hover:bg-gray-700">
                                    <td className="p-4">{vendor.name ?? "N/A"}</td>
                                    <td className="p-4">{vendor.part ?? "N/A"}</td>
                                    <td className="p-4">{vendor.email ?? "N/A"}</td>
                                    <td className="p-4">{vendor.phone ?? "N/A"}</td>
                                    <td className="p-4">{vendor.address ?? "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}
