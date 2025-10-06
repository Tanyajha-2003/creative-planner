import React, { useState } from "react";
import TaskCard from "./components/TaskCard";

interface KanbanBoardProps {
  plan: string[];
  tasksStatus: Record<string, string>;
  agents: any[];
  onRunTask: (task: string, agentId: string) => void;
}

export default function KanbanBoard({
  plan,
  tasksStatus,
  agents,
  onRunTask,
}: KanbanBoardProps) {
  const backlogTasks = plan.filter((t) => !tasksStatus[t]);
  const inProgressTasks = plan.filter((t) => tasksStatus[t] === "inProgress");
  const doneTasks = plan.filter((t) => tasksStatus[t] === "done");

  const [draggingTask, setDraggingTask] = useState<string | null>(null);

  function handleDragStart(task: string) {
    setDraggingTask(task);
  }

  function handleDrop(status: string) {
    if (draggingTask) {
      // Simulate changing task status manually for DnD polish
      const fakeAgentId = "manual"; 
      if (status === "inProgress") {
        onRunTask(draggingTask, fakeAgentId);
      }
      setDraggingTask(null);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div className="kanban">
      {/* Backlog */}
      <div
        className="col"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop("backlog")}
      >
        <h3>Backlog</h3>
        {backlogTasks.map((task, i) => (
          <div key={i} draggable onDragStart={() => handleDragStart(task)}>
            <TaskCard
              task={task}
              agents={agents}
              onRunTask={onRunTask}
            />
          </div>
        ))}
      </div>

      {/* In Progress */}
      <div
        className="col"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop("inProgress")}
      >
        <h3>In Progress</h3>
        {inProgressTasks.length === 0 && (
          <div className="dropzone">Drop task here to run</div>
        )}
        {inProgressTasks.map((task, i) => (
          <div key={i} draggable onDragStart={() => handleDragStart(task)}>
            <TaskCard
              task={task}
              agents={agents}
              onRunTask={onRunTask}
            />
          </div>
        ))}
      </div>

      {/* Done */}
      <div
        className="col"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop("done")}
      >
        <h3>Done</h3>
        {doneTasks.length === 0 && (
          <div className="dropzone">No completed tasks</div>
        )}
        {doneTasks.map((task, i) => (
          <div key={i}>
            <TaskCard
              task={task}
              agents={agents}
              onRunTask={onRunTask}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
