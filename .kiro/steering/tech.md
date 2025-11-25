# Technology Stack

## Core Technologies

- **React** 19.2.0 with TypeScript
- **Vite** (rolldown-vite@7.2.5) - Build tool and dev server
- **React Router** 7.9.6 - Client-side routing
- **TypeScript** 5.9.3
- **Tailwind CSS** 4.1.17 - Utility-first CSS framework

## Testing

- **Vitest** 4.0.13 - Unit testing framework
- **React Testing Library** 16.3.0 - Component testing utilities
- **@testing-library/jest-dom** 6.9.1 - DOM matchers
- **happy-dom** 20.0.10 - DOM environment for tests
- **fast-check** 4.3.0 - Property-based testing library

## Development Tools

- **ESLint** 9.39.1 with TypeScript ESLint
- **PostCSS** with Autoprefixer
- **@vitejs/plugin-react** - Fast Refresh support

## Common Commands

```bash
# Development
npm run dev              # Start dev server with HMR

# Building
npm run build            # TypeScript compile + production build

# Testing
npm test                 # Run tests once (use for CI)
npm run test:watch       # Run tests in watch mode

# Code Quality
npm run lint             # Run ESLint

# Preview
npm run preview          # Preview production build locally
```

## Configuration Files

- `vite.config.ts` - Vite build config + Vitest test config
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - App-specific TypeScript settings
- `tsconfig.node.json` - Node/build script TypeScript settings
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS with Tailwind plugin
- `eslint.config.js` - ESLint flat config with TypeScript rules

## Testing Configuration

- Test environment: `happy-dom`
- Test setup file: `src/test/setup.ts`
- Global test utilities available via Vitest globals
- Property-based tests should run minimum 100 iterations
- Use `// Feature: <name>, Property N: <description>` tags for property tests
