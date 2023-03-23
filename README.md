<div align="center" style="padding-bottom: 20px">
    <h1>engineer_thesis_svelte</h1>
    <img src="https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=Svelte&logoColor=white" alt=""/>&nbsp;
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt=""/>&nbsp;
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt=""/>&nbsp;
    <img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt=""/>&nbsp;
</div>

## Pre-requisites

- [Node.js](https://nodejs.org/en/) (v16.16.0 or higher)
- [pnpm](https://pnpm.io/) (v6.14.0 or higher)

## Tools, libraries, frameworks

- `svelte`
- `svelte-router-spa` - client side routing
- `axios` - http client
- `@tanstack/svelte-query` - data fetching, caching, and state management
- `bootstrap`, `sveltestrap` - UI components, mostly css styles
- `svelte-paginate` - ready to use pagination component
- `svelte-select` - advanced select component
- `svelte-toasts` - toast notifications
- `bytemd` + plugins, `highlight.js` - Markdown editor/viewer
- `vitest`, `@testing-library/svelte` - unit testing
- `playwright`, `@playwright/experimental-ct-svelte` - e2e and components testing
- `msw` - mocking http requests
- ...

## Setup

Make sure you have the pre-requisites installed.

### Environment variables

Create a `.env` file in the root directory of the project and add the following variables:

```dotenv
VITE_BACKEND_URL=http://localhost:8000/api
```

### Running the application

Install dependencies

```bash
pnpm install
```

Run development server

```bash
pnpm dev
```

### Testing

Vitest unit tests

```
pnpm test
```

Code coverage

```bash
pnpm coverage
```

Playwright e2e testing

```bash
pnpm exec playwright test
```

Playwright components testing

```bash
pnpm run test-ct
```

### Building

Building static files

```bash
pnpm build
```

## Deployment

This application has been deploy to Vercel.

### Launching the application

Go to Vercel and create a new project. Connect it to your GitHub repository and deploy it.

### Environment variables

Go to settings and add the following variables:

```dotenv
VITE_BACKEND_URL=https://engineer-thesis-api.fly.dev/api
```

---

## TODO:

- Profile page (followers, followees, favorite posts, created posts)
- Better errors in toasts
- Loading states (skeletons)
- Better UI
