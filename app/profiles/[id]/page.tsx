"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../../../lib/api";

export default function ProfileDetailPage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Record<string, unknown>>({});

  useEffect(() => {
    apiGet(`/api/v2/profiles/${params.id}`, true).then((d) => setProfile(d.data || {})).catch(() => setProfile({}));
  }, [params.id]);

  return (
    <section className="card">
      <h1>Profile Detail</h1>
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
