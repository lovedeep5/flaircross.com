import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for FlairCross Consultancy and its products including n8nautomation.cloud and VidToReels.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen py-20">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-10">
          Last updated: March 13, 2026
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed">
              FlairCross Consultancy (&quot;FlairCross,&quot; &quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;) operates the following
              properties:
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
              This Privacy Policy applies to all of the above properties and
              any related services we provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              2. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">
                  Information you provide:
                </strong>{" "}
                Name, email address, and message content when you use our
                contact forms or sign up for our products.
              </li>
              <li>
                <strong className="text-foreground">Usage data:</strong>{" "}
                Pages visited, time spent, browser type, device information,
                and IP address collected automatically through standard web
                technologies.
              </li>
              <li>
                <strong className="text-foreground">Cookies:</strong> We use
                cookies and similar technologies to improve your experience and
                analyze site traffic.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To respond to your inquiries and provide support</li>
              <li>To deliver and improve our products and services</li>
              <li>To send transactional emails related to your use of our products</li>
              <li>To analyze usage trends and improve our websites</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              4. Data Sharing
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share data with
              trusted third-party service providers (e.g., email delivery,
              hosting, analytics) solely to operate our services. These
              providers are obligated to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              5. Data Retention
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information only as long as necessary to
              fulfill the purposes outlined in this policy or as required by
              law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your location, you may have the right to access,
              correct, delete, or port your personal data. To exercise these
              rights, contact us at{" "}
              <a
                href="mailto:contact@flarecross.com"
                className="underline hover:text-primary"
              >
                contact@flarecross.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              7. Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy, please contact
              us at{" "}
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
            href="/terms"
            className="text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Terms of Service →
          </Link>
        </div>
      </div>
    </main>
  );
}
