import React from "react";

interface TaskCardProps {
  task: string;
  agents: { id: string; name: string; status?: string }[];
  onRunTask: (task: string, agentId: string) => void;
}

export default function TaskCard({ task, agents, onRunTask }: TaskCardProps) {
  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const agentId = e.target.value;
    if (agentId) {
      onRunTask(task, agentId);
    }
  }

  return (
    <div className="task-card">
      <div className="task-title">{task}</div>

      <div className="task-actions">
        <select onChange={handleSelect} defaultValue="">
          <option value="">Run with...</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} {a.status === "busy" ? "⏳ (busy)" : "✅ (idle)"}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
