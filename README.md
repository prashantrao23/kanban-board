# Kanban Board

A lightweight, responsive Kanban board for organizing tasks visually. Built with React, TypeScript and Vite.

## Features

- Create, edit and delete tasks
- Drag and drop tasks between columns (Backlog, To Do, In Progress, Done)
- Search and filter by priority
- Task priorities, labels and due dates
- Progress overview across columns
- Responsive layout with a mobile column switcher
- Tasks persist in the browser (localStorage)

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- dnd-kit (drag and drop)
- React Hook Form + Zod (forms and validation)
- date-fns, lucide-react

## Getting Started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build     # type-check and build for production
npm run preview   # preview the production build
npm run lint      # run ESLint
```

## Project Structure

```
src/
  components/   Board, Column, TaskCard, CreateTaskModal, Navbar
  store/        Zustand store (tasks, filters, persistence)
  constants/    Column and priority definitions
  types/        Shared TypeScript types
  utils/        Small helpers
```
