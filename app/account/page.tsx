"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../lib/api";
import { getCsrfTokenFromCookie } from "../../lib/csrf";

export default function AccountPage() {
  const [me, setMe] = useState<Record<string, unknown>>({});

  useEffect(() => {
    apiGet("/auth/me/").then((d) => setMe(d.data || {})).catch(() => setMe({ error: "Not authenticated" }));
  }, []);

  return (
    <section className="card">
      <h1>Account</h1>
      <table>
        <tbody>{Object.entries(me).map(([k, v]) => <tr key={k}><th>{k}</th><td>{String(v)}</td></tr>)}</tbody>
      </table>
      <button
        style={{ marginTop: 12 }}
        onClick={async () => {
          try {
            await apiPost("/auth/logout/", {}, getCsrfTokenFromCookie());
          } finally {
            window.location.href = "/login";
          }
        }}
      >
        Logout
      </button>
    </section>
  );
}
