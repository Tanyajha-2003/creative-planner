"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const KanbanBoard_1 = __importDefault(require("../src/KanbanBoard"));
const AgentPanel_1 = __importDefault(require("../src/AgentPanel"));
const ConsoleView_1 = __importDefault(require("../src/components/ConsoleView"));
const vscode = acquireVsCodeApi();
function App() {
    const [agents, setAgents] = (0, react_1.useState)([]);
    const [plan, setPlan] = (0, react_1.useState)([]);
    const [logs, setLogs] = (0, react_1.useState)([]);
    const [goal, setGoal] = (0, react_1.useState)('Create a small CLI in TypeScript that prints Hello');
    (0, react_1.useEffect)(() => {
        window.addEventListener('message', (e) => {
            const msg = e.data;
            if (msg.type === 'agents')
                setAgents(msg.agents);
            if (msg.type === 'planCreated')
                setPlan(msg.plan);
            if (msg.type === 'taskStarted')
                addLog(`→ Started: ${msg.task} ${msg.agentId ? 'on agent ' + msg.agentId : ''}`);
            if (msg.type === 'taskFinished')
                addLog(`✔ Finished: ${msg.task} — ${msg.result}`);
            if (msg.type === 'allDone')
                addLog('🎉 All done');
        });
        vscode.postMessage({ type: 'requestAgents' });
    }, []);
    function addLog(s) { setLogs(l => [...l, s]); }
    function handlePlanAndRun() {
        setLogs([`Planning for: ${goal}`]);
        vscode.postMessage({ type: 'planAndRun', goal });
    }
    function runTaskWithAgent(task, agentId) {
        vscode.postMessage({ type: 'runTask', task, agentId });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app", children: [(0, jsx_runtime_1.jsx)("header", { children: (0, jsx_runtime_1.jsx)("h2", { children: "Traycer \u2014 Creative Planner" }) }), (0, jsx_runtime_1.jsxs)("section", { className: "controls", children: [(0, jsx_runtime_1.jsx)("textarea", { value: goal, onChange: e => setGoal(e.target.value) }), (0, jsx_runtime_1.jsx)("button", { onClick: handlePlanAndRun, children: "Plan & Execute" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "layout", children: [(0, jsx_runtime_1.jsx)(KanbanBoard_1.default, { plan: plan, onRunTask: (task, agentId) => runTaskWithAgent(task, agentId), agents: agents }), (0, jsx_runtime_1.jsxs)("aside", { children: [(0, jsx_runtime_1.jsx)(AgentPanel_1.default, { agents: agents }), (0, jsx_runtime_1.jsx)(ConsoleView_1.default, { logs: logs })] })] })] }));
}
//# sourceMappingURL=App.js.map