import { TaskRepository } from "../repositories/task.repository";

const taskRepo = new TaskRepository();

export class TaskService {
  create(data: any) {
    return taskRepo.create(data);
  }

  getAll() {
    return taskRepo.findAll();
  }

  update(id: string, data: any) {
    return taskRepo.update(id, data);
  }

  delete(id: string) {
    return taskRepo.delete(id);
  }
}
