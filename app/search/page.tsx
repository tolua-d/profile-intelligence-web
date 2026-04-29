"use client";

import { useState } from "react";
import { apiGet } from "../../lib/api";

type Item = { id: string; name: string; gender: string; age: number; country_id: string };

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Item[]>([]);
  const [exporting, setExporting] = useState(false);

  const performSearch = async () => {
    const d = await apiGet(`/api/v2/profiles/search?q=${encodeURIComponent(q)}&page=1&limit=10`, true);
    setRows(d.data || []);
  };

  const exportToCSV = async () => {
    if (exporting) return;
    
    if (!q.trim()) {
      alert("Please enter a search query first.");
      return;
    }

    setExporting(true);
    try {
      // Fetch all search results (remove pagination limit)
      const response = await apiGet(`/api/v2/profiles/search?q=${encodeURIComponent(q)}&page=1&limit=10000`, true);
      const allResults = response.data || [];

      if (allResults.length === 0) {
        alert("No search results to export.");
        return;
      }

      // Convert to CSV
      const headers = ["Name", "Gender", "Age", "Country"];
      const csvContent = [
        headers.join(","),
        ...allResults.map((p: Item) => [
          `"${p.name.replace(/"/g, '""')}"`, // Escape quotes in CSV
          `"${p.gender}"`,
          p.age,
          `"${p.country_id}"`
        ].join(","))
      ].join("\n");

      // Create and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `search_results_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export search results:", error);
      alert("Failed to export search results. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const enableExport = process.env.NEXT_PUBLIC_ENABLE_EXPORT === "true";

  return (
    <section className="card">
      <h1>Natural Language Search</h1>
      <div className="row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='e.g. "young males from nigeria"' style={{ minWidth: 320 }} />
        <button onClick={performSearch}>Search</button>
        {enableExport && (
          <button 
            onClick={exportToCSV} 
            disabled={exporting}
            style={{ 
              backgroundColor: "#28a745", 
              marginLeft: 8,
              opacity: exporting ? 0.6 : 1 
            }}
          >
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        )}
      </div>
      <table style={{ marginTop: 14 }}>
        <thead><tr><th>Name</th><th>Gender</th><th>Age</th><th>Country</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.id}><td>{r.name}</td><td>{r.gender}</td><td>{r.age}</td><td>{r.country_id}</td></tr>)}</tbody>
      </table>
    </section>
  );
}
