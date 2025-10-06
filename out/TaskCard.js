"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TaskCard;
const jsx_runtime_1 = require("react/jsx-runtime");
function TaskCard({ task, agents, onRunTask }) {
    function handleSelect(e) {
        const agentId = e.target.value;
        if (agentId) {
            onRunTask(task, agentId);
        }
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "task-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "task-title", children: task }), (0, jsx_runtime_1.jsx)("div", { className: "task-actions", children: (0, jsx_runtime_1.jsxs)("select", { onChange: handleSelect, defaultValue: "", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Run with..." }), agents.map((a) => ((0, jsx_runtime_1.jsxs)("option", { value: a.id, children: [a.name, " ", a.status === "busy" ? "⏳ (busy)" : "✅ (idle)"] }, a.id)))] }) })] }));
}
//# sourceMappingURL=TaskCard.js.map