import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "../../src/App";

describe("App integration tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the initial tasks", () => {
    render(<App />);

    expect(
      screen.getByText("Set up development environment"),
    ).toBeInTheDocument();
    expect(screen.getByText("Build CI/CD pipeline")).toBeInTheDocument();
    expect(
      screen.getByText("Configure application monitoring"),
    ).toBeInTheDocument();
  });

  it("filters tasks by status", () => {
    render(<App />);

    fireEvent.change(screen.getByDisplayValue("All tasks"), {
      target: { value: "pending" },
    });

    expect(
      screen.getByText("Configure application monitoring"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Build CI/CD pipeline")).not.toBeInTheDocument();
  });

  it("filters tasks by search text", () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText("Search tasks..."), {
      target: { value: "pipeline" },
    });

    expect(screen.getByText("Build CI/CD pipeline")).toBeInTheDocument();
    expect(
      screen.queryByText("Configure application monitoring"),
    ).not.toBeInTheDocument();
  });

  it("creates a new task and saves it to localStorage", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /new task/i }));

    fireEvent.change(screen.getByPlaceholderText("What needs to be done?"), {
      target: { value: "Configure Docker" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(screen.getByText("Configure Docker")).toBeInTheDocument();

    const savedTasks = JSON.parse(
      localStorage.getItem("taskflow-tasks") ?? "[]",
    );

    expect(savedTasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Configure Docker",
          status: "pending",
        }),
      ]),
    );
  });

  it("updates a task status", () => {
    render(<App />);

    const statusSelect = screen.getByLabelText(
      "Status of Build CI/CD pipeline",
    );

    fireEvent.change(statusSelect, {
      target: { value: "completed" },
    });

    expect(statusSelect).toHaveValue("completed");
  });

  it("deletes a task after confirmation", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<App />);

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Delete task",
      })[0],
    );

    expect(
      screen.queryByText("Set up development environment"),
    ).not.toBeInTheDocument();
  });

  it("falls back to initial tasks when localStorage contains invalid data", () => {
    localStorage.setItem("taskflow-tasks", "{invalid json");

    render(<App />);

    expect(
      screen.getByText("Set up development environment"),
    ).toBeInTheDocument();
  });

  it("filters tasks using the sidebar buttons", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /pending/i }));

    expect(
      screen.getByText("Configure application monitoring"),
    ).toBeInTheDocument();

    expect(screen.queryByText("Build CI/CD pipeline")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /in progress/i }));

    expect(screen.getByText("Build CI/CD pipeline")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /completed/i }));

    expect(
      screen.getByText("Set up development environment"),
    ).toBeInTheDocument();
  });

  it("edits an existing task", () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole("button", { name: "Edit task" })[0]);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");

    fireEvent.change(titleInput, {
      target: { value: "Updated development environment" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      screen.getByText("Updated development environment"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Set up development environment"),
    ).not.toBeInTheDocument();
  });
});
