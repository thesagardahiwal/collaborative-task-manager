// 🔥 MOCK IO FIRST
jest.mock("../index", () => ({
  io: require("../__mocks__/io").io,
}));

import { TaskService } from "./task.service";
import { TaskRepository } from "../repositories/task.repository";
import { io } from "../index";

describe("TaskService", () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService();
    jest.clearAllMocks();
  });

  /* -----------------------------
     1️⃣ CREATE TASK TEST
  ----------------------------- */
  it("should create task and emit TASK_CREATED", async () => {
    const task = {
      _id: "task1",
      title: "Test Task",
      creatorId: "user1",
      assignedToId: null,
    };

    // ✅ mock the INTERNAL repo instance
    jest
      .spyOn(TaskRepository.prototype, "create")
      .mockResolvedValue(task as any);

    const result = await service.create(task);

    expect(result).toEqual(task);
    expect(io.emit).toHaveBeenCalledWith(
      "taskEvent",
      expect.objectContaining({
        type: "TASK_CREATED",
        taskId: "task1",
      })
    );
  });

  /* -----------------------------
     2️⃣ UPDATE TASK TEST
  ----------------------------- */
  it("should update task and emit TASK_UPDATED", async () => {
    const oldTask = {
      _id: "task1",
      title: "Old Task",
      creatorId: "user1",
      assignedToId: null,
    };

    const updatedTask = {
      ...oldTask,
      title: "Updated Task",
    };

    jest
      .spyOn(TaskRepository.prototype, "findById")
      .mockResolvedValue(oldTask as any);

    jest
      .spyOn(TaskRepository.prototype, "update")
      .mockResolvedValue(updatedTask as any);

    await service.update("task1", { title: "Updated Task" });

    expect(io.emit).toHaveBeenCalledWith(
      "taskEvent",
      expect.objectContaining({
        type: "TASK_UPDATED",
        taskId: "task1",
      })
    );
  });

  /* -----------------------------
     3️⃣ DELETE TASK TEST
  ----------------------------- */
  it("should delete task and emit TASK_DELETED", async () => {
    const task = {
      _id: "task1",
      title: "Test Task",
      creatorId: "user1",
      assignedToId: null,
    };

    jest
      .spyOn(TaskRepository.prototype, "findById")
      .mockResolvedValue(task as any);

    jest
      .spyOn(TaskRepository.prototype, "delete")
      .mockResolvedValue(true as any);

    await service.delete("task1");

    expect(io.emit).toHaveBeenCalledWith(
      "taskEvent",
      expect.objectContaining({
        type: "TASK_DELETED",
        taskId: "task1",
      })
    );
  });
});
