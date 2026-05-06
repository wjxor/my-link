# GEMINI.md - Project Context

## Project Overview
This is a modern web application built with **Next.js 15+** (App Router) and **TypeScript**. The project is structured with a primary application directory named `my-profile`. It uses **Tailwind CSS 4** for styling and **ESLint** for code quality.

- **Primary Technologies:** Next.js, React 19, TypeScript, Tailwind CSS 4, ESLint.
- **Architecture:** Next.js App Router (located in `my-profile/app`).
- **Styling:** Tailwind CSS 4 using the new `@import "tailwindcss"` syntax and inline theme configuration in `globals.css`.

## Directory Structure
- `my-profile/`: The main application directory.
  - `app/`: Next.js App Router source files (pages, layouts, globals.css).
  - `public/`: Static assets (images, icons, svgs).
  - `tsconfig.json`: TypeScript configuration (strict mode enabled).
  - `eslint.config.mjs`: ESLint configuration using the flat config format.
  - `package.json`: Dependency management and scripts.
- `hanyang_ascii.txt`, `hanyang_logo_ascii.txt`: Supplemental ASCII art files.

## Building and Running
Commands should be executed within the `my-profile` directory:

| Task | Command |
| :--- | :--- |
| Development | `npm run dev` |
| Build | `npm run build` |
| Start (Production) | `npm run start` |
| Lint | `npm run lint` |

## Development Conventions
- **TypeScript:** Strict mode is enabled. Use explicit types and avoid `any`. Path aliases are configured (e.g., `@/*` points to `./*`).
- **Styling:** Use Tailwind CSS utility classes. The theme is configured in `my-profile/app/globals.css` using CSS variables and the `@theme` block.
- **Fonts:** Geist and Geist Mono fonts are loaded via `next/font/google` and configured as CSS variables.
- **Components:** Functional components with React 19 features.
- **Linting:** Adhere to the rules defined in `eslint.config.mjs`, which includes Next.js vitals and TypeScript-specific rules.
