# JSON-LD Templates

## Contents

- Organization (Company Homepage)
- Article / Blog Post
- FAQPage
- HowTo
- Product (SaaS)
- BreadcrumbList
- Multiple Schema on One Page (`@graph`)

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

Use when the page contains a section with questions and answers — does not need to be the entire page. Does not produce a rich result in Google Search anymore (removed May 7, 2026) — write it for genuine on-page structure, not to earn SERP space.

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

No Google rich result for this type since 2023 (desktop) and on every surface by 2026 — same status as FAQPage. Only worth adding if the step structure genuinely helps a reader or an AI system parse the guide.

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
