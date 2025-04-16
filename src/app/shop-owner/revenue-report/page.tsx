"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { log } from "console";

// Register chart components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

type Sale = {
  accountant_name: string;
  customer_name: string;
  item_id: number;
  price: number;
  quantity: number;
  createdAt: string; // ISO string
};

type DailyRevenue = {
  date: string;
  revenue: number;
};

type MonthlyRevenue = {
  month: string;
  revenue: number;
};

export default function RevenuePage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [view, setView] = useState<"monthly" | "daily">("monthly");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sales`);
        if (!res.ok) throw new Error("Failed to fetch sales data");
        const data = await res.json();
        console.log("data");
        
        setSales(data);
      } catch (err) {
        setMessage("Error fetching sales data");
      }
    };

    fetchSales();
  }, []);

  const computeMonthlyRevenue = (): MonthlyRevenue[] => {
    const monthlyMap = new Map<string, number>();

    sales.forEach((sale) => {
      const date = new Date(sale.createdAt);
      const key = date.toLocaleString("default", { month: "long", year: "numeric" });
      const amount = sale.price * sale.quantity;
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + amount);
    });

    return Array.from(monthlyMap.entries()).map(([month, revenue]) => ({ month, revenue }));
  };

  const computeLast10DaysRevenue = (): DailyRevenue[] => {
    const dailyMap = new Map<string, number>();
    const now = new Date();

    // Initialize last 10 days
    for (let i = 9; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dailyMap.set(key, 0);
    }

    sales.forEach((sale) => {
      const date = new Date(sale.createdAt);
      const key = date.toISOString().split("T")[0];
      const amount = sale.price * sale.quantity;

      if (dailyMap.has(key)) {
        dailyMap.set(key, (dailyMap.get(key) || 0) + amount);
      }
    });

    return Array.from(dailyMap.entries()).map(([date, revenue]) => ({ date, revenue }));
  };

  const monthlyData = computeMonthlyRevenue();
  const dailyData = computeLast10DaysRevenue();

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white text-black rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Revenue Dashboard</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setView("monthly")}
          className={`px-4 py-2 rounded ${view === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Monthly Graph
        </button>
        <button
          onClick={() => setView("daily")}
          className={`px-4 py-2 rounded ${view === "daily" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Last 10 Days Table
        </button>
      </div>

      {message && <p className="text-center text-red-500">{message}</p>}

      {view === "monthly" ? (
        <Line
          data={{
            labels: monthlyData.map((m) => m.month),
            datasets: [
              {
                label: "Monthly Revenue",
                data: monthlyData.map((m) => m.revenue),
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.2)",
                fill: true,
                tension: 0.3,
              },
            ],
          }}
        />
      ) : (
        <table className="w-full border mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.map((d) => (
              <tr key={d.date} className="text-center hover:bg-gray-100">
                <td className="border px-4 py-2">{d.date}</td>
                <td className="border px-4 py-2">${d.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
