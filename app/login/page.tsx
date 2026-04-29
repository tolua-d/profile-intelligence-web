"use client";

import { API_BASE_URL } from "../../lib/config";

export default function LoginPage() {
  return (
    <section className="card">
      <h1>Insighta Labs+</h1>
      <p>Secure profile intelligence portal for analysts and engineers.</p>
      <button onClick={() => (window.location.href = `${API_BASE_URL}/auth/github/login/`)}>
        Continue with GitHub
      </button>
    </section>
  );
}
