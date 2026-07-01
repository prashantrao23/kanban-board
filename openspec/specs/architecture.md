# Architecture

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Zustand
- @dnd-kit
- React Hook Form
- Zod
- date-fns

## Folder Structure

src/

components/

hooks/

store/

types/

utils/

data/

## Design Principles

- Small reusable components
- Single Responsibility Principle
- Feature-based composition
- A lightweight shared store for board state, rather than unnecessary abstraction layers
- No backend
- LocalStorage persistence
- Keep the implementation simple enough for a small, single-page board experience