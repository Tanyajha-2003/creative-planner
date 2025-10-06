"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AgentPanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function AgentPanel({ agents }) {
    const [expandedAgentId, setExpandedAgentId] = (0, react_1.useState)(null);
    const toggleExpand = (id) => {
        setExpandedAgentId(expandedAgentId === id ? null : id);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "agent-panel", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Agents" }), agents.map((a) => {
                const isExpanded = expandedAgentId === a.id;
                return ((0, jsx_runtime_1.jsxs)("div", { className: `agent ${isExpanded ? 'expanded' : ''}`, onClick: () => toggleExpand(a.id), role: "button", tabIndex: 0, onKeyDown: (e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                            toggleExpand(a.id);
                    }, children: [(0, jsx_runtime_1.jsx)("div", { className: "avatar", children: a.name.charAt(0).toUpperCase() }), (0, jsx_runtime_1.jsxs)("div", { className: "meta", children: [(0, jsx_runtime_1.jsx)("div", { className: "name", children: a.name }), (0, jsx_runtime_1.jsxs)("div", { className: `status ${a.status}`, children: [(0, jsx_runtime_1.jsx)("span", { className: `status-dot ${a.status}` }), a.status.charAt(0).toUpperCase() + a.status.slice(1)] }), isExpanded && ((0, jsx_runtime_1.jsxs)("div", { className: "details", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "ID:" }), " ", a.id] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Status:" }), " ", a.status] }), (0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("em", { children: "Click to collapse" }) })] }))] })] }, a.id));
            })] }));
}
//# sourceMappingURL=AgentPanel.js.map