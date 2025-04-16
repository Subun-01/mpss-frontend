"use client";

import { useState } from "react";

export default function AddMotorPart() {
  const [newPart, setNewPart] = useState({
    name: "",
    quantity: "",
    price: "",
    rack_position: "",
    vendor_email: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    setNewPart({ ...newPart, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Make sure all required fields are filled
    if (!newPart.name || !newPart.quantity || !newPart.price || !newPart.rack_position || !newPart.vendor_email) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPart.name,
          quantity: parseInt(newPart.quantity, 10),
          price: parseFloat(newPart.price),
          rack_position: newPart.rack_position,
          vendor_email: newPart.vendor_email,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Motor part added successfully!");
      } else {
        setMessage(data.message || "Failed to add motor part.");
      }
    } catch (error) {
      setMessage("Error adding motor part.");
    }

    // Reset the form
    setNewPart({ name: "", quantity: "", price: "", rack_position: "", vendor_email: "" });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg ">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Add Motor Part</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={newPart.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md text-gray-800"
          />
        </div>

        <div>
          <label className="block text-gray-700">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={newPart.quantity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md text-gray-800"
          />
        </div>

        <div>
          <label className="block text-gray-700">Price:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={newPart.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md text-gray-800"
          />
        </div>

        <div>
          <label className="block text-gray-700">Rack Position:</label>
          <input
            type="text"
            name="rack_position"
            value={newPart.rack_position}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md text-gray-800"
          />
        </div>

        <div>
          <label className="block text-gray-700">Vendor Email:</label>
          <input
            type="email"
            name="vendor_email"
            value={newPart.vendor_email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md text-gray-800"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
          Add Part
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}
