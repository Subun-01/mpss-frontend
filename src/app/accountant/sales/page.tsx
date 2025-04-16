"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

// Types
type Part = {
  part_id: number;
  name: string;
  price: number;
  quantity: number;
};

type FormState = {
  accountantName: string;
  customerName: string;
  itemId: string;
  quantity: string;
};

type Bill = {
  accountantName: string;
  customerName: string;
  item: string;
  itemId: number;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
};

export default function SalesPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [form, setForm] = useState<FormState>({
    accountantName: "",
    customerName: "",
    itemId: "",
    quantity: ""
  });
  const [bill, setBill] = useState<Bill | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch inventory data from backend
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inventory`)
      .then(res => res.json())
      .then((data: Part[]) => setParts(data))
      .catch(() => setMessage("Failed to load inventory."));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerateBill = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { accountantName, customerName, itemId, quantity } = form;
    const requestedQuantity = parseInt(quantity, 10);
    const id = parseInt(itemId, 10);

    if (!accountantName || !customerName || !itemId || !quantity) {
      setMessage("Please fill all fields");
      return;
    }

    const part = parts.find(p => p.part_id === id);
    if (!part) {
      setMessage("Item not available");
      return;
    }

    if (requestedQuantity > part.quantity) {
      setMessage("Insufficient quantity in stock");
      return;
    }

    const totalAmount = requestedQuantity * part.price;

    const newBill: Bill = {
      accountantName,
      customerName,
      item: part.name,
      itemId: part.part_id,
      unitPrice: part.price,
      quantity: requestedQuantity,
      totalAmount
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountant_name: accountantName,
          customer_name: customerName,
          item_id: part.part_id,
          price: part.price,
          quantity: requestedQuantity
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to save sale");

      const updatedParts = parts.map(p =>
        p.part_id === id
          ? { ...p, quantity: p.quantity - requestedQuantity }
          : p
      );
      setParts(updatedParts);
      setBill(newBill);
      setMessage("Bill generated and sale recorded successfully!");
      setForm({ accountantName: "", customerName: "", itemId: "", quantity: "" });
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-teal-600 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Generate Bill</h2>
      <form onSubmit={handleGenerateBill} className="space-y-4">
        <input
          type="text"
          name="accountantName"
          placeholder="Accountant Name"
          value={form.accountantName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        <input
          type="number"
          name="itemId"
          placeholder="Item ID"
          value={form.itemId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Generate Bill
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-100">{message}</p>}

      {bill && (
        <div className="mt-6 p-4 border rounded-md text-gray-950 bg-gray-50">
          <h3 className="text-xl font-bold mb-2">Bill Details</h3>
          <p><strong>Accountant:</strong> {bill.accountantName}</p>
          <p><strong>Customer:</strong> {bill.customerName}</p>
          <p><strong>Item:</strong> {bill.item} (ID: {bill.itemId})</p>
          <p><strong>Unit Price:</strong> ₹{bill.unitPrice.toFixed(2)}</p>
          <p><strong>Quantity:</strong> {bill.quantity}</p>
          <p><strong>Total Amount:</strong> ₹{bill.totalAmount.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
