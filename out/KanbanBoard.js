"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KanbanBoard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const TaskCard_1 = __importDefault(require("./components/TaskCard"));
function KanbanBoard({ plan, tasksStatus, agents, onRunTask, }) {
    const backlogTasks = plan.filter((t) => !tasksStatus[t]);
    const inProgressTasks = plan.filter((t) => tasksStatus[t] === "inProgress");
    const doneTasks = plan.filter((t) => tasksStatus[t] === "done");
    const [draggingTask, setDraggingTask] = (0, react_1.useState)(null);
    function handleDragStart(task) {
        setDraggingTask(task);
    }
    function handleDrop(status) {
        if (draggingTask) {
            // Simulate changing task status manually for DnD polish
            const fakeAgentId = "manual"; // you can change this if needed
            if (status === "inProgress") {
                onRunTask(draggingTask, fakeAgentId);
            }
            setDraggingTask(null);
        }
    }
    function handleDragOver(e) {
        e.preventDefault();
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "kanban", children: [(0, jsx_runtime_1.jsxs)("div", { className: "col", onDragOver: handleDragOver, onDrop: () => handleDrop("backlog"), children: [(0, jsx_runtime_1.jsx)("h3", { children: "Backlog" }), backlogTasks.map((task, i) => ((0, jsx_runtime_1.jsx)("div", { draggable: true, onDragStart: () => handleDragStart(task), children: (0, jsx_runtime_1.jsx)(TaskCard_1.default, { task: task, agents: agents, onRunTask: onRunTask }) }, i)))] }), (0, jsx_runtime_1.jsxs)("div", { className: "col", onDragOver: handleDragOver, onDrop: () => handleDrop("inProgress"), children: [(0, jsx_runtime_1.jsx)("h3", { children: "In Progress" }), inProgressTasks.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "dropzone", children: "Drop task here to run" })), inProgressTasks.map((task, i) => ((0, jsx_runtime_1.jsx)("div", { draggable: true, onDragStart: () => handleDragStart(task), children: (0, jsx_runtime_1.jsx)(TaskCard_1.default, { task: task, agents: agents, onRunTask: onRunTask }) }, i)))] }), (0, jsx_runtime_1.jsxs)("div", { className: "col", onDragOver: handleDragOver, onDrop: () => handleDrop("done"), children: [(0, jsx_runtime_1.jsx)("h3", { children: "Done" }), doneTasks.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "dropzone", children: "No completed tasks" })), doneTasks.map((task, i) => ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(TaskCard_1.default, { task: task, agents: agents, onRunTask: onRunTask }) }, i)))] })] }));
}
//# sourceMappingURL=KanbanBoard.js.map