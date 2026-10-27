# Simple Task Manager

A study project for practicing TDD (test-driven development): a small task manager built test-first with React and TypeScript.

The app lets you:

- list tasks loaded from a (mocked) API
- add a new task
- mark a task as completed or active
- delete a task
- filter tasks by All, Active or Completed
- see totals for all, completed and active tasks, plus a progress percentage

## Stack

- React 19 + TypeScript, bundled with Vite
- Zustand for state (with optimistic updates for toggling and deleting)
- Axios for HTTP calls to `/api`
- Tailwind CSS
- Vitest + jsdom, React Testing Library and user-event for tests
- MSW (Mock Service Worker) to mock the REST API (`GET`/`POST /api/tasks`, `PUT`/`DELETE /api/tasks/:id`) in tests and in the browser during development
- Biome for linting and formatting

## Getting started

This project uses pnpm.

```bash
pnpm install
pnpm dev
```

## Running tests

```bash
pnpm test
```
