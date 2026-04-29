"use client";

import { useState } from "react";
import { apiGet } from "../../lib/api";

type Item = { id: string; name: string; gender: string; age: number; country_id: string };

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Item[]>([]);

  return (
    <section className="card">
      <h1>Natural Language Search</h1>
      <div className="row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='e.g. "young males from nigeria"' style={{ minWidth: 320 }} />
        <button onClick={async () => {
          const d = await apiGet(`/api/v2/profiles/search?q=${encodeURIComponent(q)}&page=1&limit=10`, true);
          setRows(d.data || []);
        }}>Search</button>
      </div>
      <table style={{ marginTop: 14 }}>
        <thead><tr><th>Name</th><th>Gender</th><th>Age</th><th>Country</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.id}><td>{r.name}</td><td>{r.gender}</td><td>{r.age}</td><td>{r.country_id}</td></tr>)}</tbody>
      </table>
    </section>
  );
}
