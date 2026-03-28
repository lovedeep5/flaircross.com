import Link from "next/link";

export const metadata = {
  title: "Payment Cancelled | FlairCross",
  robots: { index: false },
};

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Payment Cancelled</h1>
          <p className="text-muted-foreground mt-2">
            Your payment was cancelled and you have not been charged. You can return to the shop whenever you&apos;re ready.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Back to Shop
          </Link>
          <Link href="/" className="px-6 py-2.5 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
