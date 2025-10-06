import React, { useEffect, useState } from "react";
import KanbanBoard from "../src/KanbanBoard";
import AgentPanel from "../src/AgentPanel";
import ConsoleView from "../src/components/ConsoleView";

// VS Code API
declare const acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

export default function App() {
  const [agents, setAgents] = useState<any[]>([]);
  const [plan, setPlan] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [goal, setGoal] = useState("Create a small CLI in TypeScript that prints Hello");
  const [tasksStatus, setTasksStatus] = useState<Record<string, string>>({});

  //  Restore saved state on load
  useEffect(() => {
    const savedState = vscode.getState();
    if (savedState) {
      if (savedState.plan) setPlan(savedState.plan);
      if (savedState.logs) setLogs(savedState.logs);
      if (savedState.agents) setAgents(savedState.agents);
      if (savedState.tasksStatus) setTasksStatus(savedState.tasksStatus);
    }
  }, []);

  // Listen for messages from the extension (Planner)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const msg = e.data;
      switch (msg.type) {
        case "agents":
          setAgents(msg.agents);
          break;

        case "planCreated":
          setPlan(msg.plan);
          setTasksStatus({});
          addLog(`📋 Plan created with ${msg.plan.length} steps`);
          break;

        case "taskStarted":
          setTasksStatus((prev) => ({ ...prev, [msg.task]: "inProgress" }));
          updateAgentStatus(msg.agentId, "busy");
          addLog(`→ Started: ${msg.task}`);
          break;

        case "taskFinished":
          setTasksStatus((prev) => ({ ...prev, [msg.task]: "done" }));
          updateAgentStatus(msg.agentId, "idle");
          addLog(`✔ Finished: ${msg.task} — ${msg.result}`);
          break;

        case "allDone":
          addLog("🎉 All done!");
          break;

        //  Support for manual DnD status updates
        case "manualStatusUpdate":
          setTasksStatus((prev) => ({
            ...prev,
            [msg.task]: msg.status || undefined,
          }));
          break;

        case "restoreState":
          if (msg.state.plan) setPlan(msg.state.plan);
          if (msg.state.logs) setLogs(msg.state.logs);
          if (msg.state.agents) setAgents(msg.state.agents);
          if (msg.state.tasksStatus) setTasksStatus(msg.state.tasksStatus);
          break;
      }
    };

    window.addEventListener("message", handler);
    vscode.postMessage({ type: "requestAgents" });

    return () => window.removeEventListener("message", handler);
  }, []);

  //  Persist state on changes
  useEffect(() => {
    const stateToSave = { plan, logs, agents, tasksStatus };
    vscode.setState(stateToSave);
    vscode.postMessage({ type: "saveState", state: stateToSave });
  }, [plan, logs, agents, tasksStatus]);

  function addLog(entry: string) {
    setLogs((prev) => [...prev, entry]);
  }

  function handlePlanAndRun() {
    setLogs([`🧠 Planning for: ${goal}`]);
    vscode.postMessage({ type: "planAndRun", goal });
  }

  // Auto-run task on dropdown selection
  function runTaskWithAgent(task: string, agentId: string) {
    if (!agentId) return;
    vscode.postMessage({ type: "runTask", task, agentId });
  }

  //  Agent busy/idle status updates
  function updateAgentStatus(agentId: string, status: string) {
    setAgents((prevAgents) =>
      prevAgents.map((a) =>
        a.id === agentId ? { ...a, status } : a
      )
    );
  }

  return (
    <div className="app">
      <header>
        <h2>Traycer — Creative Planner</h2>
      </header>

      <section className="controls">
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={3}
        />
        <button onClick={handlePlanAndRun}>📝 Plan & Execute</button>
      </section>

      <div className="layout">
        <KanbanBoard
          plan={plan}
          agents={agents}
          tasksStatus={tasksStatus}
          onRunTask={runTaskWithAgent}
        />

        <aside>
          <AgentPanel agents={agents} />
          <ConsoleView logs={logs} />
        </aside>
      </div>
    </div>
  );
}
