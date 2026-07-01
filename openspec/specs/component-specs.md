# Component Specifications

## Navbar

Responsibilities

- Show application title
- Search tasks
- Toggle theme

Props

None

---

## Board

Responsibilities

- Render all columns
- Manage drag context

---

## Column

Responsibilities

- Display column title
- Display task count
- Render tasks
- Highlight during drag

Props

status

title

tasks

---

## Task Card

Responsibilities

- Display task details
- Drag source
- Open edit modal

Props

task

---

## Create Task Modal

Responsibilities

- Create new task
- Validate form
- Submit task

Props

open

onClose

onCreate