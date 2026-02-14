export type BlogContentBlock = {
  heading?: string;
  body?: string[];
  list?: string[];
  highlight?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
  content: BlogContentBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "automation-blueprint-agencies",
    title: "Automation Blueprint for High-Touch Agencies",
    description:
      "A practical framework for agencies that want to productize their client onboarding and delivery with n8n and Zapier.",
    excerpt:
      "Learn how to stitch proposals, contracts, onboarding forms, and project kickoffs into a single, resilient automation fabric.",
    publishedAt: "2026-01-28",
    category: "Automation Strategy",
    readingTime: "6 min read",
    tags: ["n8n", "Zapier", "Agency Ops"],
    featured: true,
    content: [
      {
        body: [
          "High-touch agencies often rely on heroic project managers who juggle CRMs, docs, and Slack threads to kick off new clients. That works until the pipeline fills up and manual steps start slipping through the cracks."
        ]
      },
      {
        heading: "Workflow architecture",
        body: [
          "We map every recurring touchpoint, then group the steps into three automation tracks: revenue ops (proposal → deposit), delivery ops (intake → kickoff), and success ops (check-ins → QBRs). Each track gets its own n8n workflow snapshot so teams can iterate without breaking the whole system."
        ],
        list: [
          "Proposal signed? Trigger PandaDoc → create deal in HubSpot → capture payment link",
          "Client completes intake? Generate ClickUp spaces, folders, and templates automatically",
          "Kickoff date booked? Spin up a shared Notion hub with agenda + next steps"
        ]
      },
      {
        heading: "Human-in-the-loop controls",
        body: [
          "Not every task should be fully autonomous. We insert lightweight human approvals inside Slack: workflow payloads are summarized, a reviewer can approve or request edits, and n8n resumes instantly. That keeps accountability without slowing delivery."
        ]
      },
      {
        heading: "Stack recommendations",
        body: [
          "n8n becomes the orchestration layer, Zapier handles quick wins or niche connectors, and Supabase stores normalized state. This hybrid approach lets agencies own their IP while still delivering fast proofs-of-concept."
        ],
        highlight:
          "Result: teams reclaim 15+ hours per client launch, and clients get a predictable onboarding journey."
      }
    ]
  },
  {
    slug: "voice-ai-pipelines",
    title: "Designing Voice AI Pipelines with OpenCall and CRM Data",
    description:
      "How we pair OpenCall, n8n, and analytics layers to run outbound campaigns without losing the human touch.",
    excerpt:
      "Voice agents are only as good as the data that feeds them. Here’s how to prep your CRM and follow-up loops so AI callers stay useful.",
    publishedAt: "2025-12-12",
    category: "Voice AI",
    readingTime: "7 min read",
    tags: ["OpenCall", "CRM", "AI Agents"],
    featured: true,
    content: [
      {
        body: [
          "Most teams experiment with voice AI by uploading a CSV, crossing their fingers, and hoping the calls sound natural. The wins are bigger when you treat every call as part of a feedback loop that syncs back to your CRM in near real time."
        ]
      },
      {
        heading: "Data hygiene matters",
        body: [
          "Before a single call is placed we normalize phone numbers, opt-in flags, and personas. n8n enriches each lead with industry, timezone, and the latest support activity so the agent has context for the script."
        ]
      },
      {
        heading: "Dynamic scripting",
        body: [
          "OpenCall pulls talking points from a prompt template that references CRM fields. We version those prompts in Git so marketing, sales, and compliance can collaborate without overwriting each other."
        ]
      },
      {
        heading: "Closed-loop reporting",
        body: [
          "Every disposition (callback requested, wrong number, qualified) flows back into HubSpot and a PostHog dashboard. That lets teams see conversion curves, A/B test language, and automatically reassign leads to reps when human follow-up is needed."
        ],
        highlight:
          "With the loop in place, call-to-demo booking rates increased by 32% while manual dialing time dropped to near zero."
      }
    ]
  },
  {
    slug: "automation-playbook-client-onboarding",
    title: "Automation Playbook: Client Onboarding in 10 Steps",
    description:
      "A reusable checklist for service companies that want reliable onboarding without bloated headcount.",
    excerpt:
      "Use this 10-step automation checklist to move a signed client from contract to first value in under a week.",
    publishedAt: "2025-11-03",
    category: "Playbooks",
    readingTime: "5 min read",
    tags: ["Client Onboarding", "Playbook", "Operations"],
    content: [
      {
        body: [
          "Client onboarding fails when every department uses a different checklist. This playbook combines CRM automations, shared documentation, and proactive alerts so every handoff is visible."
        ]
      },
      {
        heading: "The 10 steps",
        list: [
          "Contract signed → auto-create project shell + owner",
          "Invoice scheduled → confirm payment method",
          "Kickoff survey sent → automatically remind after 48 hours",
          "Assets checklist generated in Notion",
          "Slack or Teams channel spun up with naming conventions",
          "Credentials vault shared securely via 1Password",
          "Timeline + success metrics logged in CRM",
          "Training resources personalized and delivered",
          "Executive sponsor summary emailed",
          "30-day milestone review scheduled automatically"
        ]
      },
      {
        heading: "Tooling",
        body: [
          "n8n handles state transitions, Supabase stores metadata, and Linear/ClickUp receive tasks. Alerts go through Slack with contextual buttons so owners can pause or fast-track steps."
        ]
      },
      {
        heading: "Rollout tips",
        body: [
          "Pilot the workflow with one offer, record every exception, and bake the best ones into conditional logic. Within two cycles the checklist becomes a living system that adapts as your product evolves."
        ],
        highlight:
          "Teams that followed this playbook saw onboarding time drop from 21 days to 6 without hiring additional coordinators."
      }
    ]
  }
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
