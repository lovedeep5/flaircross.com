import Link from "next/link";

export const metadata = {
  title: "Payment Successful | FlairCross",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Payment Successful</h1>
          <p className="text-muted-foreground mt-2">
            Thank you for your purchase! Your order is confirmed and you&apos;ll receive an email receipt shortly.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/portal/overview" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Go to Portal
          </Link>
          <Link href="/shop" className="px-6 py-2.5 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
