"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "../../lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [total, setTotal] = useState<number>(0);
  const [user, setUser] = useState<string>("-");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Debug: Check cookies
        console.log("Current cookies:", document.cookie);

        // Check authentication first
        try {
          const authData = await apiGet("/auth/me/");
          console.log("Auth successful:", authData);
          setUser(authData.data?.username || "-");
        } catch (authError) {
          // If auth fails, redirect to login
          console.error("Auth failed:", authError);
          router.push("/login");
          return;
        }

        // Fetch profiles
        try {
          const profilesData = await apiGet("/api/v2/profiles?page=1&limit=1", true);
          setTotal(Number(profilesData.total || 0));
        } catch (profileError) {
          console.error("Failed to fetch profiles:", profileError);
          setTotal(0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <section className="card">
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <>
          <p>Welcome, @{user}</p>
          <p>Total profiles: {total}</p>
        </>
      )}
    </section>
  );
}
