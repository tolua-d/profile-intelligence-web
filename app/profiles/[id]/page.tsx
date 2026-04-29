"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../../../lib/api";

export default function ProfileDetailPage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Record<string, unknown>>({});

  useEffect(() => {
    apiGet(`/api/v2/profiles/${params.id}`, true).then((d) => setProfile(d.data || {})).catch(() => setProfile({}));
  }, [params.id]);

  const exportToCSV = () => {
    if (!profile || Object.keys(profile).length === 0) {
      alert("No profile data to export.");
      return;
    }

    try {
      // Convert profile to CSV
      const headers = Object.keys(profile);
      const values = Object.values(profile);
      const csvContent = [
        headers.join(","),
        values.map(v => `"${String(v)}"`).join(",")
      ].join("\n");

      // Create and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `profile_${params.id}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export profile:", error);
      alert("Failed to export profile. Please try again.");
    }
  };

  return (
    <section className="card">
      <h1>Profile Detail</h1>
      <button onClick={exportToCSV} style={{ backgroundColor: "#28a745", marginBottom: 12 }}>Export CSV</button>
      <table>
        <tbody>
          {Object.entries(profile).map(([k, v]) => (
            <tr key={k}><th>{k}</th><td>{String(v)}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
