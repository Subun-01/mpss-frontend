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

export default function DeleteMotorPart() {
  const [parts, setParts] = useState<InventoryPart[]>([]);
  const [deleteInput, setDeleteInput] = useState("");
  const [message, setMessage] = useState("");

  // Fetch current inventory
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inventory`);
        setParts(res.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setMessage("Failed to load inventory.");
      }
    };

    fetchParts();
  }, []);

  const handleDelete = async () => {
    if (!deleteInput) {
      setMessage("Please enter a part ID or name.");
      return;
    }

    const isNumber = /^\d+$/.test(deleteInput); // Check if input is numeric
    const payload = isNumber
      ? { part_id: parseInt(deleteInput, 10) }
      : { name: deleteInput };

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inventory`, {
        data: payload,
      });

      setMessage(res.data.message);

      // Filter updated parts list
      setParts((prev) =>
        prev.filter(
          (part) =>
            part.part_id !== payload.part_id &&
            part.name.toLowerCase() !== payload.name?.toLowerCase()
        )
      );
    } catch (error: any) {
      const msg = error.response?.data?.message || "Delete failed.";
      setMessage(msg);
    }

    setDeleteInput("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">Delete Motor Part</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Enter ID or Name:</label>
        <input
          type="text"
          value={deleteInput}
          onChange={(e) => setDeleteInput(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-gray-800"
          placeholder="e.g. 101 or Brake Pad"
        />
      </div>

      <button
        onClick={handleDelete}
        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
      >
        Delete Part
      </button>

      {message && <p className="mt-4 text-center text-red-600">{message}</p>}

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">Current Motor Parts</h3>
        <ul>
          {parts.map((part) => (
            <li key={part._id} className="mb-1">
              <strong>{part.name}</strong> (ID: {part.part_id}) - Qty: {part.quantity} - Price: ${part.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
