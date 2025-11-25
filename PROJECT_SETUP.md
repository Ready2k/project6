# Financial Agent Desktop Demo - Project Setup

## Project Structure

```
financial-agent-desktop-demo/
├── src/
│   ├── components/
│   │   ├── static/          # Static view components
│   │   ├── dynamic/         # Dynamic view components
│   │   ├── shared/          # Shared components
│   │   └── tiles/           # Tile components
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── data/                # Timeline JSON files and mock data
│   └── test/                # Test setup and utilities
├── tests/
│   ├── unit/                # Unit tests
│   └── property/            # Property-based tests
└── ...
```

## Installed Dependencies

### Production Dependencies
- `react` (^19.2.0)
- `react-dom` (^19.2.0)
- `react-router-dom` (^7.9.6)

### Development Dependencies
- `vite` (rolldown-vite@7.2.5) - Build tool
- `typescript` (~5.9.3)
- `vitest` (^4.0.13) - Testing framework
- `@testing-library/react` (^16.3.0) - React testing utilities
- `@testing-library/jest-dom` (^6.9.1) - DOM matchers
- `happy-dom` (^20.0.10) - DOM environment for tests
- `fast-check` (^4.3.0) - Property-based testing library
- `tailwindcss` (^4.1.17) - CSS framework
- `@tailwindcss/postcss` (^4.1.17) - Tailwind PostCSS plugin
- `autoprefixer` (^10.4.22) - CSS autoprefixer

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Configuration Files

- `vite.config.ts` - Vite and Vitest configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.node.json` - Node-specific TypeScript config

## Testing Setup

- Vitest is configured with `happy-dom` environment
- Test setup file: `src/test/setup.ts`
- Property-based tests use `fast-check` library
- Each property test should run minimum 100 iterations

## Next Steps

Proceed to Task 2: Define TypeScript types and interfaces
