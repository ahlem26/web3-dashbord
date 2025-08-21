"use client";

import { ChartBarActive } from "@/components/crypto/TopExpensiveChart"

export default function DashboardPage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full">
        <ChartBarActive />
      </div>
    </main>
  );
}
