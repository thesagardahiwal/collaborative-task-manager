import { z } from "zod";

export const CreateTaskDto = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.string(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  status: z.enum(["To Do", "In Progress", "Review", "Completed"]).optional(),
  assignedToId: z.string().optional()
});

export type CreateTaskInput = z.infer<typeof CreateTaskDto>;
