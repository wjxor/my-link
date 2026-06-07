# GEMINI.md - MyLink Project Guide

This file defines the structure, tech stack, development conventions, and key commands for the **MyLink** project. Review this guide before starting any tasks.

## 1. Project Overview
**MyLink** is a service for developers and creators to aggregate and share various links (portfolios, SNS, blogs, etc.) on a single page.

- **Core Tech Stack**: 
  - **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui
  - **Backend/Auth**: Firebase (Authentication, Firestore)
- **Key Features**: Google Social Login, unique URL slugs (`/[displayName]`), inline link editing, automatic favicon fetching, visitor statistics.

## 2. Reference Documents
Project design and policies are based on the following documents in `@docs/`:
- **`@docs/PRD.md`**: Product Requirements Document. Includes feature lists, data modeling (Firestore structure), and tech stack details.
- **`@docs/WIREFRAME.md`**: UI/UX Wireframes. Covers layouts (ASCII/Mermaid), component structures, and design points.
- **`@docs/USER_SCENARIO.md`**: User Scenarios. Details visitor and owner flows, including exception handling (404, Empty States).

## 3. Directory Structure
- `app/`: Next.js App Router (pages and layouts)
- `components/`: Reusable UI components
  - `components/ui/`: Atomic components based on shadcn/ui
- `docs/`: Design documents (PRD, User Scenario, Wireframe)
- `lib/`: Utility functions and configs (e.g., `utils.ts`)
- `hooks/`: Custom React hooks
- `public/`: Static assets (images, favicons, etc.)

## 4. Building and Running
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Format**: `npm run format` (using Prettier)
- **Type Check**: `npm run typecheck`

## 5. Development Conventions
- **Communication**: Use the `@filename` format when referencing or mentioning files (e.g., `@GEMINI.md`, `@docs/PRD.md`).
- **TypeScript**: Adhere to strict type checking (`strict: true`) and prefer explicit type definitions.
- **Path Aliases**: Reference internal paths using the `@/` alias (e.g., `import { Button } from "@/components/ui/button"`).
- **Styling**: Use Tailwind CSS v4 and shadcn/ui components. Use the `cn()` utility for complex conditional styling.
- **State & Data**: Use the Firebase SDK for real-time Firestore synchronization.
- **Design & UX Principles**: 
  - **Mobile-First**: Maintain a mobile-responsive layout (e.g., `max-w-md`) even on PC for a consistent experience.
  - **Inline Edit**: Implement seamless editing for links and profiles via direct text clicks and `Enter` key saves, minimizing modals or page transitions.
  - **Minimal Depth**: Use confirmation dialogs only for destructive actions (e.g., deletion).
  - **Feedback**: Provide immediate feedback via shadcn/ui Toast notifications for all CRUD actions.
  - **States**: Implement clear Empty States ("Add your first link") and 404 pages for non-existent slugs.
  - **Theme**: Dark/Light mode toggle is not a priority (Single theme default).

## 6. Data Modeling (Firestore)
Follow the structure defined in `@docs/PRD.md`:
- `users` (Collection) -> `{uid}` (Document)
  - `links` (Sub-collection) -> `{auto-generated-id}` (Document)

## 7. Critical Notes
- **Duplicate Check**: Ensure `displayName` is unique as it serves as the URL slug.
- **Favicons**: Do not store favicon images in the DB; fetch them dynamically using the Google Favicon API on the client side.
- **Language**: While this guide is in English for token efficiency, communication and commit messages should remain in Korean as per user preference.
