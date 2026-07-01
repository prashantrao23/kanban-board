# Data Model

## Task

```ts
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  labels: Label[];
  dueDate?: string;
  createdAt: string;
}

type TaskStatus = "backlog" | "todo" | "in-progress" | "done";

type Priority = "low" | "medium" | "high" | "urgent";

interface Label {
  id: string;
  name: string;
  color: string;
}
```
