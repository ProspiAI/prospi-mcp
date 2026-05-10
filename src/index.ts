#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCampaignTools } from "./tools/campaigns.js";
import { registerDncTools } from "./tools/dnc.js";
import { registerDomainTools } from "./tools/domains.js";
import { registerEmailAccountTools } from "./tools/email-accounts.js";
import { registerLeadTools } from "./tools/leads.js";
import { registerListTools } from "./tools/lists.js";
import { registerSequenceTools } from "./tools/sequences.js";

const PROSPI_KNOWLEDGE = `# Prospi - Product Knowledge Base
Last updated: 2026-05-10

## What Is Prospi

Prospi is an AI-powered cold email platform for B2B companies. Complete cold email infrastructure in one platform - from lead sourcing to AI personalization to email delivery and inbox management.

Core promise: "Cold email tool that gets real responses from real buyers."

Key differentiator: Prospi measures **positive reply rate** (genuine buying interest only), not total reply rate. Competitors count "No thanks" and "Remove me" as replies - Prospi does not. Example: competitor claims 8.4% reply rate where 80% are negative; Prospi reports 6.2% positive reply rate only.

Website: prospi.ai | App: app.prospi.ai | Founder: Jovan Ivkovic

---

## How It Works (5-Step Flow)

1. Business onboarding - connect your domain and set up workspace
2. Email account setup - DNS configuration (SPF, DKIM, DMARC) + 28-day warmup
3. Lead list building - search 325M+ database with filters
4. AI-personalized campaign creation - automated research + unique openers per prospect
5. Inbox management - auto-categorized replies, push notifications, meeting booking

---

## Key Features

### Lead Database
- 325M+ verified leads across 62M+ companies
- 187M+ ecommerce leads (separate dataset)
- 98.2% email accuracy
- 50+ data points per record
- Filters: job title, industry, company size, revenue, technology stack, intent signals, hiring activity
- Unlimited lead lists, no storage caps
- Credit-based pricing (only charged for double-verified contacts)

### Prospi Agent (AI Enrichment)
- Automated prospect research: analyzes websites, LinkedIn activity, funding news
- Generates unique personalized opening lines per prospect
- 93% personalization scoring
- Inbox management at scale
- Mobile number data access

### Email Infrastructure
- Automatic account warmup (28-day gradual ramp)
- DNS auto-configuration (SPF, DKIM, DMARC)
- 96%+ inbox placement rate
- 0.8% spam rate
- 1.2% bounce rate
- Google Workspace accounts available at $3.50/month (70% cheaper than retail)

### Campaign Management
- Multi-step email sequences
- A/B testing
- Smart scheduling and follow-up automation
- Spam avoidance technology
- Campaign analytics: opens, replies, bookings

### Smart Inbox
- AI-categorized responses (interested / not interested / out of office / bounced / referral)
- Slack and email notifications for positive replies
- Auto-categorization at scale

### Mobile App
- Push notifications for positive replies
- AI-suggested response templates
- Direct meeting booking from mobile

---

## Pricing

### Model
Credits-based system. Pay for verified leads only. Sending, warmup, AI personalization, and inbox management are included unlimited.

### Base Plan
- **$197/month** (monthly billing)
- $0.10 per verified contact (1 credit = 1 verified lead)
- Annual billing: 25% discount

### Credit Volume Discounts
| Credits | Discount |
|---------|----------|
| 2,000   | Base price ($0.10/contact) |
| 5,000   | 20% savings |
| 10,000  | 30% savings |
| 15,000  | 40% savings |

### Email Accounts (Add-on)
- $3.50/month per Google Workspace email account

### What's Included in All Plans
- Unlimited email accounts and warmup
- Unlimited campaigns, A/B testing, follow-ups
- 325M+ general leads database + 187M+ ecommerce leads
- AI-powered personalization (Prospi Agent)
- Smart inbox with auto-categorization
- Slack/email notifications
- Mobile app access

### Billing Details
- Monthly and annual options
- Credits can be upgraded or downgraded at any time (effective next billing cycle)
- Only pay for double-verified contacts - unverified emails do not consume credits
- Payment: Visa, Mastercard, Amex via Stripe
- Enterprise: invoicing available

### Free Trial
Yes - start free, only pay when ready to send campaigns requiring verified leads.

---

## Target Customers (ICP)

- B2B SaaS companies
- Sales agencies
- Enterprise sales teams
- Consultants and freelancers
- Series A-C funded companies (50-500 employees)

---

## Key Stats / Social Proof

- 300+ B2B companies using the platform
- 325M+ verified leads, 62M+ companies
- 98.2% email accuracy
- 96%+ inbox placement rate
- 0.8% spam rate, 1.2% bounce rate
- 93% personalization scoring
- Example results: 1,247 emails sent, 68% open rate, 12% reply rate, 34 booked meetings

Testimonial: "I tested 10 different cold email platforms and Prospi is by far the best one." - Tomas Morkunas, Co-founder, Premium Inboxes

---

## Value Propositions

1. Complete cold email infrastructure in one platform
2. Measures positive replies, not vanity metrics
3. Only pay for verified contacts (no wasted credits)
4. Launch campaigns without hiring, writing, or manual grind
5. 28-day email warmup included automatically
6. 98.2% email accuracy - industry-leading deliverability

---

## Getting Started

- Sign up: app.prospi.ai/auth/sign-up
- Book a demo: prospi.ai
- Free trial available - no credit card required to start

---

## Blog / Educational Content Topics

1. Cold Email Deliverability Guide (SPF, DKIM, DMARC, warmup)
2. Cold Email vs LinkedIn Outreach
3. Daily sending limits (Gmail, Outlook, Google Workspace)
4. Writing cold emails for 40%+ open rates
5. Follow-up sequences best practices
6. Email warmup explained
7. Prospi vs Smartlead comparison
8. How to start a cold email agency
9. Instantly.ai alternatives
10. White label cold email for agencies
11. SPF/DKIM/DMARC setup guide
`;

const server = new McpServer({
  name: "prospi",
  version: "0.1.0",
});

// Knowledge resource - Prospi product information from prospi.ai
server.resource(
  "prospi-knowledge",
  "prospi://knowledge/website",
  {
    description: "Prospi product knowledge base: features, pricing, ICP, value props, and how the platform works. Sourced from prospi.ai.",
    mimeType: "text/markdown",
  },
  async () => ({
    contents: [
      {
        uri: "prospi://knowledge/website",
        mimeType: "text/markdown",
        text: PROSPI_KNOWLEDGE,
      },
    ],
  })
);

registerCampaignTools(server);
registerDncTools(server);
registerDomainTools(server);
registerEmailAccountTools(server);
registerLeadTools(server);
registerListTools(server);
registerSequenceTools(server);

const transport = new StdioServerTransport();
server.connect(transport);
