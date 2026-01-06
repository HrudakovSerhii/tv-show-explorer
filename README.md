# TV-Show Explorer

Small web application build with Next.js (App Router) and TypeScript that allows users to explore
a TV show and its episodes.

## Details
### Show Details Page
Display information about the TV show, including:
- Show title
- Description
- Cover image
- List of episodes (each linking to its own episode detail page)

### Episode Details Page
When clicking an episode, show:
- Episode title
- Summary
- Cover image

Data API: http://www.tvmaze.com/api

Design Reference: Atlassian Design System https://atlassian.design/

## Core Requirements
### Tech Stack
 - Next.js (w/ App Router)
 - TypeScript
 - Tailwind CSS (you can use css-in-js if you prefer, but prioritize a zero runtime one)
 - React 18+ features: React Server Components (RSC), Server Actions, etc.
 - Data fetching: Prefer Next.js server functions or TanStack Query where appropriate
 - Testing: Vitest + Testing Library for unit and component tests
 - Code quality tools: ESLint + Prettier configuration and usage

### Expected
 - Fetch and render data on the server side when possible
 - Use server actions for non-trivial operations
 - Make it accessible (ARIA attributes, keyboard navigation, screen reader-friendly)
 - The layout must be responsive

### Evaluation points:
- Ability to decide when to use client vs server components
- Understanding of data fetching strategies (SSR, SSG, RSC, caching)
- Proper TypeScript types and narrowing
- Clean, self-documenting code and meaningful commit history
- Awareness of accessibility best practices (including screen reader support and keyboard
navigation)
- Ability to reason about trade-offs and performance
- Use the Atlassian Design System: Atlassian Design
  
### Optional Enhancements

#### Data & State
- Implement episode search or pagination
- Allow users to favorite episodes (using a Server Action or a local DB mock via JSON file or in-
  memory data)

#### Testing
- Write unit and component tests with Vitest + React Testing Library
- Include coverage for core logic and at least one async flow

#### Accessibility
- Test the app with a screen reader (or Lighthouse accessibility audit)
- Implement keyboard navigation and ensure the app is fully navigable via keyboard
- Show intentional use of aria-labels, roles, and semantic HTML

### Deliverables
- A public GitHub repository
- Include a short README explaining:
   - Architecture decisions
   - Key trade-offs
   - What you would improve with more time
- Basic setup instructions (npm install && npm run dev)
- No deployment required, running locally is enough

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
