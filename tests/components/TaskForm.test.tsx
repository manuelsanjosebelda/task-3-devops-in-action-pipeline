import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskForm from "../../src/components/TaskForm";
import type { Task } from "../../src/types/task";

describe("TaskForm", () => {
  it("renders the form fields when creating a task", () => {
    render(<TaskForm onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(
      screen.getByPlaceholderText("What needs to be done?"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Add some details..."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create task" }),
    ).toBeInTheDocument();
  });

  it("calls onSave with the task data when submitting a valid task", () => {
    const onSave = vi.fn();

    render(<TaskForm onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("What needs to be done?"), {
      target: { value: "  Configure CI/CD  " },
    });

    fireEvent.change(screen.getByPlaceholderText("Add some details..."), {
      target: { value: "  Set up GitHub Actions  " },
    });

    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "high" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(onSave).toHaveBeenCalledWith({
      title: "Configure CI/CD",
      description: "Set up GitHub Actions",
      priority: "high",
      status: "pending",
      dueDate: undefined,
    });
  });

  it("does not save a task with an empty title", () => {
    const onSave = vi.fn();

    render(<TaskForm onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.submit(
      screen.getByRole("button", { name: "Create task" }).closest("form")!,
    );

    expect(onSave).not.toHaveBeenCalled();
  });

  it("loads existing task data when editing", () => {
    const task: Task = {
      id: "task-1",
      title: "Deploy application",
      description: "Deploy to staging",
      priority: "high",
      status: "in-progress",
      createdAt: "2026-11-08",
      dueDate: "2026-11-20",
    };

    render(<TaskForm task={task} onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByDisplayValue("Deploy application")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Deploy to staging")).toBeInTheDocument();
    expect(screen.getByLabelText("Priority")).toHaveValue("high");
    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("preserves the existing status when editing a task", () => {
    const onSave = vi.fn();

    const task: Task = {
      id: "task-1",
      title: "Deploy application",
      description: "Deploy to staging",
      priority: "medium",
      status: "in-progress",
      createdAt: "2026-11-08",
    };

    render(<TaskForm task={task} onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Deploy application",
        status: "in-progress",
      }),
    );
  });

  it("calls onCancel when the cancel button is clicked", () => {
    const onCancel = vi.fn();

    render(<TaskForm onSave={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("updates the due date when the user changes it", () => {
    const onSave = vi.fn();

    render(<TaskForm onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Due date"), {
      target: { value: "2026-11-20" },
    });

    fireEvent.change(screen.getByPlaceholderText("What needs to be done?"), {
      target: { value: "Deploy application" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Deploy application",
        dueDate: "2026-11-20",
      }),
    );
  });
});
