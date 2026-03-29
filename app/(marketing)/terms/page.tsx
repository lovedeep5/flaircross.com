import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for FlairCross Consultancy and its products including n8nautomation.cloud and VidToReels.",
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-10">
          Last updated: March 13, 2026
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) govern your use of the
              websites and services operated by FlairCross Consultancy
              (&quot;FlairCross,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;), including:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">flaircross.com</strong> —
                our consultancy website
              </li>
              <li>
                <strong className="text-foreground">
                  <a
                    href="https://n8nautomation.cloud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    n8nautomation.cloud
                  </a>
                </strong>{" "}
                — a product by FlairCross
              </li>
              <li>
                <strong className="text-foreground">
                  <a
                    href="https://vidtoreels.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    vidtoreels.com
                  </a>
                </strong>{" "}
                — a product by FlairCross
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              By accessing or using any of these properties, you agree to be
              bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              2. Use of Services
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to use our services only for lawful purposes and in
              accordance with these Terms. You must not use our services in any
              way that could damage, disable, or impair the services or
              interfere with any other party&apos;s use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              3. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All content, features, and functionality on our websites —
              including text, graphics, logos, and software — are owned by
              FlairCross Consultancy and are protected by intellectual property
              laws. You may not reproduce, distribute, or create derivative
              works without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              4. User Accounts
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you create an account on any of our products, you are
              responsible for maintaining the security of your account
              credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              5. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, FlairCross Consultancy
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising out of or in connection with your
              use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              6. Disclaimer
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              7. Changes to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes
              will be effective upon posting to this page. Your continued use
              of our services constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these Terms, please contact us at{" "}
              <a
                href="mailto:contact@flarecross.com"
                className="underline hover:text-primary"
              >
                contact@flarecross.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Privacy Policy →
          </Link>
        </div>
      </div>
    </main>
  );
}
