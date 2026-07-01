# Component Specifications

## Navbar

Responsibilities

- Show the application title
- Provide a board-level search affordance if the feature is later introduced
- Keep the shell minimal for the MVP

Props

None

---

## Board

Responsibilities

- Render all columns
- Manage drag context for task movement
- Provide the overall board layout

---

## Column

Responsibilities

- Display the column title
- Display the task count
- Render tasks in that column
- Show an empty state when no tasks exist
- Highlight during drag interaction

Props

status

title

tasks

---

## Task Card

Responsibilities

- Display task details such as title, priority, and due date
- Support drag-and-drop interaction
- Open the edit task flow

Props

task

---

## Task Form Modal

Responsibilities

- Create or edit a task
- Validate the form before submission
- Submit task data to the store
- Manage focus and keyboard behavior for accessibility

Props

open

onClose

onSubmit

mode