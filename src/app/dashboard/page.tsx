"use client";

import { fetchCryptos } from "@/lib/fetchCrypto";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560", "#775DD0", "#546E7A", "#26A69A", "#D10CE8"];

export default function DashboardPage() {
  const [cryptos, setCryptos] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const data = await fetchCryptos();
      setCryptos(data);
    })();
  }, []);

  if (cryptos.length === 0) {
    return <p>Loading...</p>;
  }

  const topExpensive = [...cryptos].sort((a, b) => b.current_price - a.current_price).slice(0, 10);
  const topVolume = [...cryptos].sort((a, b) => b.total_volume - a.total_volume).slice(0, 3);
  const topMarketCap = [...cryptos].sort((a, b) => b.market_cap - a.market_cap).slice(0, 3);
  const cheapest = [...cryptos].sort((a, b) => a.current_price - b.current_price).slice(0, 5);
  const topATL = [...cryptos].sort((a, b) => a.atl - b.atl).slice(0, 5);
  const topATH = [...cryptos].sort((a, b) => b.ath - a.ath).slice(0, 10);

  const renderBarChart = (title: string, data: any[], dataKey: string) => (
    <div className="mb-12">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="w-full h-96">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#0088FE">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPieChart = (title: string, data: any[], dataKey: string) => (
    <div className="mb-12">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="w-full h-96">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              outerRadius={120}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Dashboard Overview</h2>

      {renderBarChart("Top 10 Most Expensive Cryptocurrencies", topExpensive, "current_price")}
      {renderPieChart("Top 3 Cryptocurrencies By Volume", topVolume, "total_volume")}
      {renderPieChart("Top 3 Cryptocurrencies By Market Cap", topMarketCap, "market_cap")}
      {renderPieChart("Top 5 Cheapest Cryptocurrencies", cheapest, "current_price")}
      {renderBarChart("Top 5 Cryptocurrencies By All-Time-Low", topATL, "atl")}
      {renderBarChart("Top 10 Cryptocurrencies By All-Time-High", topATH, "ath")}
    </div>
  );
}
