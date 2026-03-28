"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BuyButtonProps {
  productId: string;
  priceId: string;
  mode: "payment" | "subscription";
}

export function BuyButton({ productId, priceId, mode }: BuyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    setError("");
    setLoading(true);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, price_id: priceId, mode }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (res.status === 401) {
        router.push(`/auth/login?next=/shop/${productId}`);
        return;
      }
      setError(data.error ?? "Failed to start checkout");
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Redirecting…" : mode === "subscription" ? "Subscribe Now" : "Buy Now"}
      </button>
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </div>
  );
}
