"use client";

import { useState } from "react";

export function StripeToggle({ initialTestMode }: { initialTestMode: boolean }) {
  const [testMode, setTestMode] = useState(initialTestMode);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function toggle() {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/admin/stripe-mode", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testMode: !testMode }),
    });
    setLoading(false);
    if (res.ok) {
      setTestMode(!testMode);
      setMsg("Saved");
    } else {
      setMsg("Failed to save");
    }
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">Stripe Test Mode</p>
        <p className="text-sm text-muted-foreground">
          {testMode
            ? "Using test keys — charges are simulated, no real money moves"
            : "Using live keys — real charges apply"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
        <button
          onClick={toggle}
          disabled={loading}
          aria-label="Toggle Stripe test mode"
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
            testMode ? "bg-yellow-500" : "bg-green-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              testMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`text-sm font-semibold w-8 ${testMode ? "text-yellow-600" : "text-green-600"}`}>
          {testMode ? "TEST" : "LIVE"}
        </span>
      </div>
    </div>
  );
}
