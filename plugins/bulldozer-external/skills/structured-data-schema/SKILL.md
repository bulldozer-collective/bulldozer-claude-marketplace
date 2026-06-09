---
name: |
  structured-data-schema
description: |
  Implement schema markup and structured data to enable rich search results and improve AI content understanding. Triggers on 'schema markup,' 'structured data,' 'JSON-LD,' 'rich snippets,' 'FAQ schema,' or 'star ratings in search.' For broader SEO, see seo-audit. For AI search optimization, see seo-ai-search.
when-to-use: |
  Implement schema markup and structured data to enable rich search results and improve AI content understanding. Triggers on 'schema markup,' 'structured data,' 'JSON-LD,' 'rich snippets,' 'FAQ schema,' or 'star ratings in search.' For broader SEO, see seo-audit. For AI search optimization, see seo-ai-search.
argument-hint: |
  Blog post pages — want FAQ schema and Article markup
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Schema Markup

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on structured data. Your goal is to implement schema.org markup that helps search engines understand content and enables rich results in Google Search.

## Input

`$ARGUMENTS` — page type, URL, or content description (e.g., "pricing page," "blog posts," or paste the page content). If not provided, read any available context files before asking. Only ask if you have no page content or URL.

## Output

Ready-to-paste JSON-LD code blocks for each schema type needed, plus a validation checklist. Output includes: schema type rationale, complete JSON-LD with all required and recommended properties, implementation instructions for the platform (static HTML, Next.js, WordPress), and validation steps.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Core Rules

**Use JSON-LD format** — Google recommends it. Place in `<head>` or end of `<body>`. Easier to implement and maintain than Microdata or RDFa.

**Accuracy first** — schema must accurately represent page content. Don't markup content that doesn't exist on the page. Inaccurate schema can trigger manual actions.

**Validate before deploying** — always test with Google's Rich Results Test (https://search.google.com/test/rich-results). Fix errors before launch.

---

## Common Schema Types by Page

| Page type | Schema to implement | Rich result enabled |
|-----------|--------------------|--------------------|
| Company homepage | Organization + WebSite | Sitelinks search box |
| Blog post | Article + BreadcrumbList | Article rich result |
| How-to guide | HowTo + Article | How-to rich results |
| FAQ page or FAQ section | FAQPage | FAQ rich results |
| Product page | Product + AggregateRating | Product rich results |
| SaaS/app page | SoftwareApplication + Product | App rich results |
| Event or webinar | Event | Event rich results |
| Local business | LocalBusiness | Knowledge panel |
| Recipe | Recipe | Recipe rich results |

---

## JSON-LD Templates

### Organization (Company Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "One-sentence description of what the company does.",
  "sameAs": [
    "https://twitter.com/company",
    "https://linkedin.com/company/company",
    "https://github.com/company"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@example.com"
  }
}
```

### Article / Blog Post

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Article Title Here",
  "description": "Meta description or article summary.",
  "image": "https://example.com/article-image.jpg",
  "datePublished": "2024-01-15",
  "dateModified": "2024-03-20",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/team/author-name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Company Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}
```

### FAQPage

Use when the page contains a section with questions and answers — does not need to be the entire page.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is [your product]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Full answer text here. Keep it complete — this is what appears in search."
      }
    },
    {
      "@type": "Question",
      "name": "How much does [your product] cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pricing starts at $X/month for the [Starter] plan. See full pricing at example.com/pricing."
      }
    }
  ]
}
```

### HowTo

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to [accomplish task]",
  "description": "Brief description of what this guide covers.",
  "totalTime": "PT30M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1: Do this",
      "text": "Detailed instructions for step 1.",
      "image": "https://example.com/step1-image.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Step 2: Then this",
      "text": "Detailed instructions for step 2."
    }
  ]
}
```

### Product (SaaS)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Product Name",
  "description": "What the product does.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "49",
    "priceCurrency": "USD",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "312"
  }
}
```

### BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://example.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title",
      "item": "https://example.com/blog/article-slug"
    }
  ]
}
```

### Multiple Schema on One Page (`@graph`)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "name": "...", "url": "..." },
    { "@type": "WebSite", "name": "...", "url": "..." },
    { "@type": "BreadcrumbList", "itemListElement": [...] }
  ]
}
```

---

## Implementation by Platform

**Static HTML**: Add JSON-LD directly in `<head>` template. Use includes/partials for reusable schema.

**Next.js**: Use `next/head` or the `metadata` API for JSON-LD in page components. Server-side render for SEO.

```jsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObject) }}
/>
```

**WordPress**: Use Yoast SEO, Rank Math, or Schema Pro plugins. All inject JSON-LD automatically. For custom schema, add via `wp_head` hook or child theme.

---

## Validation Checklist

- [ ] Validates without errors in Google Rich Results Test
- [ ] All required properties included (check schema.org docs for each type)
- [ ] No mismatch between schema content and visible page content
- [ ] Dates in ISO 8601 format (YYYY-MM-DD)
- [ ] URLs fully qualified (https://, not just /path)
- [ ] Prices use numeric string ("49" not "$49")
- [ ] Monitor Google Search Console > Enhancements for errors after deployment

---

## Common Errors

| Error | Fix |
|-------|-----|
| Missing required property | Check schema.org docs for the type — each type has required and recommended properties |
| Date format invalid | Use ISO 8601: "2024-01-15" not "January 15, 2024" |
| Price includes currency symbol | Price must be numeric: "49" not "$49" |
| Schema doesn't match page content | Never markup what isn't visible on the page |
| FAQPage answer is HTML | Use plain text in `acceptedAnswer.text` or minimal HTML — test in Rich Results Test |