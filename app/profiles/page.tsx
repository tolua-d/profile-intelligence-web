"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../lib/api";
import { getCsrfTokenFromCookie } from "../../lib/csrf";

type Profile = { id: string; name: string; gender: string; age: number; country_id: string };

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [page, setPage] = useState(1);
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("analyst");
  const [name, setName] = useState("");
  const [exporting, setExporting] = useState(false);

  const load = () => {
    const q = new URLSearchParams({ page: String(page), limit: "10" });
    if (gender) q.set("gender", gender);
    apiGet(`/api/v2/profiles?${q.toString()}`, true).then((d) => setProfiles(d.data || [])).catch(() => setProfiles([]));
  };

  const exportToCSV = async () => {
    if (exporting) return;
    
    setExporting(true);
    try {
      // Fetch all profiles with current filters (remove pagination limit)
      const q = new URLSearchParams({ page: "1", limit: "10000" }); // Large limit to get all
      if (gender) q.set("gender", gender);
      const response = await apiGet(`/api/v2/profiles?${q.toString()}`, true);
      const allProfiles = response.data || [];

      if (allProfiles.length === 0) {
        alert("No profiles to export.");
        return;
      }

      // Convert to CSV
      const headers = ["Name", "Gender", "Age", "Country"];
      const csvContent = [
        headers.join(","),
        ...allProfiles.map((p: Profile) => [
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
      link.setAttribute("download", `profiles_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export profiles:", error);
      alert("Failed to export profiles. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    load();
    apiGet("/auth/me/").then((d) => setRole(d.data?.role || "analyst")).catch(() => setRole("analyst"));
  }, [page, gender]);

  const enableExport = process.env.NEXT_PUBLIC_ENABLE_EXPORT === "true";

  return (
    <section className="card">
      <h1>Profiles</h1>
      <div className="row">
        <input value={gender} onChange={(e) => setGender(e.target.value)} placeholder="gender" />
        <button onClick={load}>Apply</button>
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
        <button onClick={() => setPage(Math.max(1, page - 1))}>Prev</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {role === "admin" && (
        <div className="row" style={{ marginTop: 12 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="new profile name" />
          <button
            onClick={async () => {
              await apiPost("/api/v2/profiles", { name }, getCsrfTokenFromCookie(), true);
              setName("");
              load();
            }}
          >
            Create Profile
          </button>
        </div>
      )}

      <table style={{ marginTop: 14 }}>
        <thead><tr><th>Name</th><th>Gender</th><th>Age</th><th>Country</th><th></th></tr></thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td><td>{p.gender}</td><td>{p.age}</td><td>{p.country_id}</td>
              <td><Link href={`/profiles/${p.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
