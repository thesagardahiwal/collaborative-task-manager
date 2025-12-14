import { z } from "zod";
import { CreateTaskDto } from "./create-task.dto";

export const UpdateTaskDto = CreateTaskDto.partial();
export type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;
