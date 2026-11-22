import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "../../src/components/TaskCard";
import type { Task } from "../../src/types/task";

const mockTask: Task = {
  id: "1",
  title: "Configure CI/CD pipeline",
  description: "Set up automated testing",
  status: "pending",
  priority: "high",
  createdAt: "2026-11-08",
  dueDate: "2026-11-15",
};

describe("TaskCard", () => {
  it("renders the task information correctly", () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Configure CI/CD pipeline")).toBeInTheDocument();
    expect(screen.getByText("Set up automated testing")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("Due: 2026-11-15")).toBeInTheDocument();
  });

  it("calls onStatusChange when the status changes", () => {
    const onStatusChange = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onStatusChange={onStatusChange}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    fireEvent.change(
      screen.getByLabelText("Status of Configure CI/CD pipeline"),
      {
        target: { value: "completed" },
      },
    );

    expect(onStatusChange).toHaveBeenCalledWith("1", "completed");
  });

  it("calls onEdit when the edit button is clicked", () => {
    const onEdit = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onStatusChange={vi.fn()}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit task" }));

    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  it("calls onDelete when the delete button is clicked", () => {
    const onDelete = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onStatusChange={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete task" }));

    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
